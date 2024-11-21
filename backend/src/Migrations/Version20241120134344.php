<?php

declare(strict_types=1);

// namespace DoctrineMigrations;
namespace App\Migrations;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241120134344 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE user_id_seq CASCADE');
        $this->addSql('CREATE SEQUENCE users_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE aichat (id INT NOT NULL, aicid INT NOT NULL, userid INT NOT NULL, content_data JSON NOT NULL, timestampai TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE chat (id INT NOT NULL, sender_id INT NOT NULL, recipient_id INT NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, is_read BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_659DF2AAF624B39D ON chat (sender_id)');
        $this->addSql('CREATE INDEX IDX_659DF2AAE92F8F78 ON chat (recipient_id)');
        $this->addSql('CREATE TABLE mook (id INT NOT NULL, owner_id INT DEFAULT NULL, title VARCHAR(255) NOT NULL, content_data JSON NOT NULL, is_private BOOLEAN NOT NULL, share_link VARCHAR(36) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9386B3678B6B9468 ON mook (share_link)');
        $this->addSql('CREATE INDEX IDX_9386B3677E3C61F9 ON mook (owner_id)');
        $this->addSql('CREATE TABLE mook_shared_users (mook_id INT NOT NULL, user_id INT NOT NULL, PRIMARY KEY(mook_id, user_id))');
        $this->addSql('CREATE INDEX IDX_758EB179E0EAC368 ON mook_shared_users (mook_id)');
        $this->addSql('CREATE INDEX IDX_758EB179A76ED395 ON mook_shared_users (user_id)');
        $this->addSql('CREATE TABLE users (id INT NOT NULL, username VARCHAR(180) NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, birthday DATE DEFAULT NULL, slogan VARCHAR(255) DEFAULT NULL, interest JSON DEFAULT NULL, phone VARCHAR(15) DEFAULT NULL, address TEXT DEFAULT NULL, profile_picture VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1483A5E9F85E0677 ON users (username)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1483A5E9E7927C74 ON users (email)');
        $this->addSql('ALTER TABLE chat ADD CONSTRAINT FK_659DF2AAF624B39D FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE chat ADD CONSTRAINT FK_659DF2AAE92F8F78 FOREIGN KEY (recipient_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE mook ADD CONSTRAINT FK_9386B3677E3C61F9 FOREIGN KEY (owner_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE mook_shared_users ADD CONSTRAINT FK_758EB179E0EAC368 FOREIGN KEY (mook_id) REFERENCES mook (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE mook_shared_users ADD CONSTRAINT FK_758EB179A76ED395 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE users_id_seq CASCADE');
        $this->addSql('CREATE SEQUENCE user_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('ALTER TABLE chat DROP CONSTRAINT FK_659DF2AAF624B39D');
        $this->addSql('ALTER TABLE chat DROP CONSTRAINT FK_659DF2AAE92F8F78');
        $this->addSql('ALTER TABLE mook DROP CONSTRAINT FK_9386B3677E3C61F9');
        $this->addSql('ALTER TABLE mook_shared_users DROP CONSTRAINT FK_758EB179E0EAC368');
        $this->addSql('ALTER TABLE mook_shared_users DROP CONSTRAINT FK_758EB179A76ED395');
        $this->addSql('DROP TABLE aichat');
        $this->addSql('DROP TABLE chat');
        $this->addSql('DROP TABLE mook');
        $this->addSql('DROP TABLE mook_shared_users');
        $this->addSql('DROP TABLE users');
    }
}
