<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250108144314 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE AIChat (id INT NOT NULL, aicid INT NOT NULL, userid INT NOT NULL, contentData JSON NOT NULL, timestampai TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE Chat (id INT NOT NULL, sender_id INT NOT NULL, recipient_id INT NOT NULL, content TEXT NOT NULL, createdAt TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, isRead BOOLEAN NOT NULL, image VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C5AF5D94F624B39D ON Chat (sender_id)');
        $this->addSql('CREATE INDEX IDX_C5AF5D94E92F8F78 ON Chat (recipient_id)');
        $this->addSql('CREATE TABLE Mook (id INT NOT NULL, title VARCHAR(255) NOT NULL, isPrivate BOOLEAN NOT NULL, contentData TEXT NOT NULL, creatorId VARCHAR(255) NOT NULL, createdAt TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updatedAt TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, shareLink VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE users (id INT NOT NULL, username VARCHAR(180) NOT NULL, email VARCHAR(180) DEFAULT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, birthday DATE DEFAULT NULL, slogan VARCHAR(255) DEFAULT NULL, interest JSON DEFAULT NULL, phone VARCHAR(15) DEFAULT NULL, address TEXT DEFAULT NULL, profilePicture VARCHAR(255) DEFAULT NULL, sexe VARCHAR(10) DEFAULT NULL, facebook VARCHAR(255) DEFAULT NULL, twitter VARCHAR(255) DEFAULT NULL, instagram VARCHAR(255) DEFAULT NULL, github VARCHAR(255) DEFAULT NULL, jobs JSON DEFAULT NULL, isAdmin BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1483A5E9F85E0677 ON users (username)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1483A5E9E7927C74 ON users (email)');
        $this->addSql('ALTER TABLE Chat ADD CONSTRAINT FK_C5AF5D94F624B39D FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE Chat ADD CONSTRAINT FK_C5AF5D94E92F8F78 FOREIGN KEY (recipient_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE Chat DROP CONSTRAINT FK_C5AF5D94F624B39D');
        $this->addSql('ALTER TABLE Chat DROP CONSTRAINT FK_C5AF5D94E92F8F78');
        $this->addSql('DROP TABLE AIChat');
        $this->addSql('DROP TABLE Chat');
        $this->addSql('DROP TABLE Mook');
        $this->addSql('DROP TABLE users');
    }
}
