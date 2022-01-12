'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('post_likes', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      user_id: {
        type: Sequelize.UUID,
      },
      post_id: {
        type: Sequelize.UUID,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint('post_likes', {
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
    return await queryInterface.addConstraint('post_likes', {
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
    return queryInterface.dropTable('post_images');
  },
};
