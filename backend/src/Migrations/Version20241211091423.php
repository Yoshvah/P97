<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241211091423 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE mook_shared_users DROP CONSTRAINT fk_758eb179e0eac368');
        $this->addSql('ALTER TABLE mook_shared_users DROP CONSTRAINT fk_758eb179a76ed395');
        $this->addSql('DROP TABLE mook_shared_users');
        $this->addSql('ALTER TABLE mook DROP CONSTRAINT fk_9386b3677e3c61f9');
        $this->addSql('DROP INDEX idx_9386b3677e3c61f9');
        $this->addSql('ALTER TABLE mook DROP owner_id');
        $this->addSql('ALTER TABLE mook ALTER share_link TYPE VARCHAR(5)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE TABLE mook_shared_users (mook_id INT NOT NULL, user_id INT NOT NULL, PRIMARY KEY(mook_id, user_id))');
        $this->addSql('CREATE INDEX idx_758eb179a76ed395 ON mook_shared_users (user_id)');
        $this->addSql('CREATE INDEX idx_758eb179e0eac368 ON mook_shared_users (mook_id)');
        $this->addSql('ALTER TABLE mook_shared_users ADD CONSTRAINT fk_758eb179e0eac368 FOREIGN KEY (mook_id) REFERENCES mook (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE mook_shared_users ADD CONSTRAINT fk_758eb179a76ed395 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE mook ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE mook ALTER share_link TYPE VARCHAR(36)');
        $this->addSql('ALTER TABLE mook ADD CONSTRAINT fk_9386b3677e3c61f9 FOREIGN KEY (owner_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_9386b3677e3c61f9 ON mook (owner_id)');
    }
}
