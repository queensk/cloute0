-- Create the database
CREATE DATABASE clout0Db;

-- Use the newly created database
USE clout0Db;
-- Create the schema
CREATE SCHEMA socialClout;

-- delete tables users
-- DROP TABLE socialClout.users;
-- use master
-- DROP DATABASE clout0Db;
-- Create the database

SELECT * FROM socialClout.users
WHERE id NOT IN (
  SELECT followerId FROM socialClout.follows
  WHERE userId = 'f3ea483c-dd88-4054-81f8-8957a772ec90'
);

SELECT u.id, u.name, u.userName, u.email, u.password, u.profilePic, u.bio, u.location, u.website, u.joined, MAX(m.createAt) AS lastMessageTime
          FROM socialClout.users u
          JOIN socialClout.user_messages m
          ON u.id = m.senderId OR u.id = m.receiverId
          WHERE m.senderId = '71f6f045-d299-43f0-a3c5-410b202e79cc' OR m.receiverId = '71f6f045-d299-43f0-a3c5-410b202e79cc'
          GROUP BY u.id, u.name, u.userName, u.email, u.password, u.profilePic, u.bio, u.location, u.website, u.joined
          ORDER BY lastMessageTime DESC

SELECT u.*, MAX(m.createAt) AS lastMessageTime
FROM socialClout.users u
JOIN socialClout.user_messages m
ON u.id = m.senderId OR u.id = m.receiverId
WHERE m.senderId = '71f6f045-d299-43f0-a3c5-410b202e79cc' OR m.receiverId = '71f6f045-d299-43f0-a3c5-410b202e79cc'
GROUP BY u.id, u.name, u.userName, u.email, u.password, u.profilePic, u.bio, u.location, u.website, u.joined, u.createAt
ORDER BY lastMessageTime DESC;



SELECT DISTINCT u.* FROM socialClout.follows f JOIN socialClout.users u ON f.followerId = u.id WHERE f.userId = '71f6f045-d299-43f0-a3c5-410b202e79cc'

SELECT * FROM socialClout.users
-- Create the users table
CREATE TABLE socialClout.users (
  id UNIQUEIDENTIFIER PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  userName VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) UNIQUE NOT NULL,
  profilePic VARCHAR(500),
  bio VARCHAR(500),
  location VARCHAR(255),
  website VARCHAR(255),
  joined DATETIME,
  createAt DATETIME,
  updatedAt DATETIME
);

ALTER TABLE socialClout.users
ADD bannerPic VARCHAR(500) DEFAULT '';

SELECT * FROM socialClout.users;


CREATE TABLE socialClout.posts (
  id UNIQUEIDENTIFIER PRIMARY KEY,
  userId UNIQUEIDENTIFIER,
  post NVARCHAR(500) COLLATE Latin1_General_100_CI_AI_SC_UTF8,
  postImage VARCHAR(500),
  postVideo VARCHAR(500),
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (userId) REFERENCES socialClout.users (id)
);

SELECT * FROM socialClout.posts;
SELECT * FROM socialClout.likes WHERE id = '5BABFC18-901E-46A4-88F3-152F3ABDB0EA'
DELETE FROM socialClout.likes WHERE id = '5BABFC18-901E-46A4-88F3-152F3ABDB0EA'
-- Create the comments table
CREATE TABLE socialClout.comments (
  id UNIQUEIDENTIFIER PRIMARY KEY,
  userId UNIQUEIDENTIFIER,
  postId UNIQUEIDENTIFIER,
  comment VARCHAR(255),
  createAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (userId) REFERENCES socialClout.users (id),
  FOREIGN KEY (postId) REFERENCES socialClout.posts (id) 
);

SELECT * FROM socialClout.likes;
-- Create the likes table
CREATE TABLE socialClout.likes (
  id UNIQUEIDENTIFIER PRIMARY KEY,
  userId UNIQUEIDENTIFIER,
  postId UNIQUEIDENTIFIER,
  createAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (userId) REFERENCES socialClout.users (id) ,
  FOREIGN KEY (postId) REFERENCES socialClout.posts (id) 
);


SELECT * FROM socialClout.follows ORDER BY createAt ASC
-- Create the follows table
CREATE TABLE socialClout.follows (
  id UNIQUEIDENTIFIER PRIMARY KEY,
  userId UNIQUEIDENTIFIER,
  followerId UNIQUEIDENTIFIER,
  createAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (userId) REFERENCES socialClout.users (id) ,
  FOREIGN KEY (followerId) REFERENCES socialClout.users (id)
);

-- 
SELECT * FROM socialClout.posts
SELECT * FROM socialClout.user_messages;
SELECT * FROM socialClout.message_user_room;

DROP TABLE socialClout.user_messages
DROP TABLE socialClout.message_user_room
-- Create the message room table
CREATE TABLE socialClout.message_user_room (
  id UNIQUEIDENTIFIER PRIMARY KEY,
  room UNIQUEIDENTIFIER UNIQUE NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME
);

-- Create the messages table with the message room id column
CREATE TABLE socialClout.user_messages (
  id UNIQUEIDENTIFIER PRIMARY KEY,
  senderId UNIQUEIDENTIFIER,
  receiverId UNIQUEIDENTIFIER,
  roomId UNIQUEIDENTIFIER,
  message NVARCHAR(1000) COLLATE Latin1_General_100_CI_AI_SC_UTF8,
  seen BIT,
  image VARCHAR(500),
  audioURL VARCHAR(500),
  videoURL VARCHAR(500),
  fileURL VARCHAR(500),
  status VARCHAR(500),
  createAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (senderId) REFERENCES socialClout.users (id) ,
  FOREIGN KEY (receiverId) REFERENCES socialClout.users (id) ,
  FOREIGN KEY (roomId) REFERENCES socialClout.message_user_room (id)
);


-- -- Add a column to the messages table to reference the message room id
-- ALTER TABLE socialClout.messages
-- ADD roomId UNIQUEIDENTIFIER;

-- -- Add a foreign key constraint to the messages table to reference the message room table
-- ALTER TABLE socialClout.messages
-- ADD FOREIGN KEY (roomId) REFERENCES socialClout.message_room (id);

-- Create the messages table with the message room id column
-- CREATE TABLE socialClout.user_messages (
--   id UNIQUEIDENTIFIER PRIMARY KEY,
--   senderId UNIQUEIDENTIFIER,
--   receiverId UNIQUEIDENTIFIER,
--   roomId UNIQUEIDENTIFIER,
--   message VARCHAR(255),
--   createAt DATETIME,
--   updatedAt DATETIME,
--   FOREIGN KEY (senderId) REFERENCES socialClout.users (id) ,
--   FOREIGN KEY (receiverId) REFERENCES socialClout.users (id) ,
--   FOREIGN KEY (roomId) REFERENCES socialClout.message_room (id)
-- );


-- Create the trigger for deleting posts related to a deleted user
CREATE TRIGGER delete_posts_on_user_delete
ON socialClout.users
AFTER DELETE
AS
BEGIN
  DELETE FROM socialClout.posts
  WHERE userId IN (SELECT id FROM deleted);
END;
GO

-- Create the trigger for deleting likes related to a deleted post
CREATE TRIGGER delete_likes_on_post_delete
ON socialClout.posts
AFTER DELETE
AS
BEGIN
  DELETE FROM socialClout.likes
  WHERE postId IN (SELECT id FROM deleted);
END;
GO

-- Create the trigger for deleting follows related to a deleted user
CREATE TRIGGER delete_follows_on_user_delete
ON socialClout.users
AFTER DELETE
AS
BEGIN
  DELETE FROM socialClout.follows
  WHERE userId IN (SELECT id FROM deleted) OR followerId IN (SELECT id FROM deleted);
END;
GO

-- Create the trigger for deleting messages related to a deleted user
CREATE TRIGGER delete_messages_on_user_delete
ON socialClout.users
AFTER DELETE
AS
BEGIN
  DELETE FROM socialClout.messages
  WHERE senderId IN (SELECT id FROM deleted) OR receiverId IN (SELECT id FROM deleted);
END;
GO
