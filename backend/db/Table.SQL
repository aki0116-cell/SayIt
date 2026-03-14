CREATE DATABASE SayItDB;
GO


USE SayItDB;
GO

CREATE TABLE objects (
    object_id INT IDENTITY(1,1) PRIMARY KEY,
    type NVARCHAR(50) NOT NULL, -- 'user', 'word', 'utterance'
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE user_info (
    object_id INT PRIMARY KEY,
    user_id_string NVARCHAR(100) UNIQUE, 
    username NVARCHAR(100),
    CONSTRAINT FK_User_Object FOREIGN KEY (object_id) REFERENCES objects(object_id) ON DELETE CASCADE
);


CREATE TABLE word (
    object_id INT PRIMARY KEY,
    eword NVARCHAR(100) NOT NULL,
    cword NVARCHAR(200),
    count INT DEFAULT 1,
    context NVARCHAR(MAX),
    CONSTRAINT FK_Word_Object FOREIGN KEY (object_id) REFERENCES objects(object_id) ON DELETE CASCADE
);


CREATE TABLE utterance(
    object_id INT PRIMARY KEY,
    original_text NVARCHAR(MAX) NOT NULL,
    CONSTRAINT FK_Utterance_Object FOREIGN KEY (object_id) REFERENCES objects(object_id) ON DELETE CASCADE
);


CREATE TABLE orel (
    rel_id INT IDENTITY(1,1) PRIMARY KEY,
    from_id INT NOT NULL, 
    to_id INT NOT NULL, 
    rel_type NVARCHAR(50), 
	count INT DEFAULT 1
    
    CONSTRAINT FK_Rel_From FOREIGN KEY (from_id) REFERENCES objects(object_id),
    CONSTRAINT FK_Rel_To FOREIGN KEY (to_id) REFERENCES objects(object_id)
);
GO

CREATE INDEX IX_orel_from ON orel(from_id);
CREATE INDEX IX_orel_rel_type ON orel(rel_type);
GO

