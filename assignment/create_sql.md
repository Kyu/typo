# Create SQL Commands

## Create Tables
```sql
CREATE TABLE IF NOT EXISTS Users (
    UserID          SERIAL PRIMARY KEY,
    Username        TEXT UNIQUE,
    Password        TEXT,
    AvgWPM          DECIMAL(10,4) NOT NULL NOT NULL DEFAULT 0
);


CREATE TABLE IF NOT EXISTS Roles (
    RoleCode        Integer NOT NULL UNIQUE,
    RoleName        Text NOT NULL,
    RolePermission  SMALLINT NOT NULL DEFAULT 0,
    RoleUsers       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Rounds (
    RoundID         SERIAL PRIMARY KEY,
    UserID          Integer NOT NULL,
    WPM             DECIMAL(10,4) NOT NULL,
    RoundTime       TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT rounds_usr_id FOREIGN KEY(UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS UserRoles (
    UserID          Integer NOT NULL,
    RoleCode        INTEGER NOT NULL DEFAULT -1,
    CreatedAt       TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT roles_usr_id FOREIGN KEY(UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    CONSTRAINT roles_role_id FOREIGN KEY(RoleCode) REFERENCES Roles(RoleCode) ON DELETE SET DEFAULT
);
```

## Create Triggers
```sql
CREATE OR REPLACE FUNCTION calculate_avg_wpm() RETURNS TRIGGER AS $BODY$
    DECLARE New_AvgWPM DECIMAL(10,4);
    BEGIN
        New_AvgWPM := (
            SELECT (SUM(WPM) + NEW.WPM) / (COUNT(*) + 1)
            FROM Rounds
            WHERE UserID = NEW.UserID
            group by NEW.WPM);

        IF New_AvgWPM IS NULL THEN
            New_AvgWPM:= NEW.WPM;
        END IF;

        UPDATE Users SET AvgWPM = New_AvgWPM WHERE UserID = NEW.UserID;
        RETURN NEW;
    END;
    $BODY$
LANGUAGE plpgsql;

CREATE TRIGGER calculate_avg_trigger BEFORE INSERT OR UPDATE
    ON Rounds FOR EACH ROW
    EXECUTE PROCEDURE calculate_avg_wpm();

INSERT INTO Roles VALUES
  (1, 'User'),
  (2, 'Observer'),
  (3, 'Instructor'),
  (4, 'Organization'),
  (5, 'Admin');


CREATE OR REPLACE FUNCTION increase_user_roles() RETURNS TRIGGER AS $BODY$
    BEGIN
        UPDATE Roles
        SET RoleUsers = RoleUsers + 1
        WHERE RoleCode = NEW.RoleCode;
        RETURN NEW;
    END;
    $BODY$
LANGUAGE plpgsql;

CREATE TRIGGER inc_role_count AFTER INSERT
    ON UserRoles FOR EACH ROW
    EXECUTE PROCEDURE increase_user_roles();

CREATE OR REPLACE FUNCTION decrease_role_users_on_delete() RETURNS TRIGGER AS $BODY$
    BEGIN
        UPDATE Roles
        SET RoleUsers = RoleUsers - 1
        WHERE RoleCode = OLD.RoleCode;

        RETURN OLD;
    END;
    $BODY$
LANGUAGE plpgsql;

CREATE TRIGGER dec_role_users_on_del AFTER DELETE
    ON UserRoles FOR EACH ROW
    EXECUTE PROCEDURE decrease_role_users_on_delete();

CREATE OR REPLACE FUNCTION decrease_role_users_on_update() RETURNS TRIGGER AS $BODY$
    BEGIN
        IF (NEW.RoleCode <> OLD.RoleCode) THEN
            UPDATE Roles
            SET RoleUsers = RoleUsers + 1
            WHERE RoleCode = NEW.RoleCode;

            UPDATE Roles
            SET RoleUsers = RoleUsers - 1
            WHERE RoleCode = OLD.RoleCode;
        END IF;

        RETURN NEW;
    END;
    $BODY$
LANGUAGE plpgsql;

CREATE TRIGGER dec_role_users_on_up AFTER UPDATE
    ON UserRoles FOR EACH ROW
    EXECUTE PROCEDURE decrease_role_users_on_update();

CREATE OR REPLACE FUNCTION set_user_role() RETURNS TRIGGER AS $BODY$
    BEGIN
        INSERT INTO UserRoles VALUES (NEW.UserID, 1);
        RETURN NEW;
    END;
    $BODY$
LANGUAGE plpgsql;

CREATE TRIGGER add_user_role AFTER INSERT
    ON Users FOR EACH ROW
    EXECUTE PROCEDURE set_user_role();
```
