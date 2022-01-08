'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('post_comments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      comment: {
        type: Sequelize.TEXT,
      },
      user_id: {
        type: Sequelize.UUID,
      },
      post_id: {
        type: Sequelize.UUID,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint('post_comments', {
      fields: ['post_id'],
      type: 'foreign key',
      name: 'post_id',
      references: {
        table: 'posts',
        field: 'id',
      },
      onDelete: 'no action',
      onUpdate: 'no action',
    });
    return await queryInterface.addConstraint('post_comments', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'user_id',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'no action',
      onUpdate: 'no action',
    });
  },

  down: async queryInterface => {
    return queryInterface.dropTable('post_comments');
  },
};
