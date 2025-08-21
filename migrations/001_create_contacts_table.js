/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('contacts', function (table) {
        table.increments('id').primary();
        table.string('phoneNumber').nullable();
        table.string('email').nullable();
        table.integer('linkedId').nullable();
        table.enum('linkPrecedence', ['primary', 'secondary']).defaultTo('primary');
        table.timestamps(true, true);
        table.timestamp('deletedAt').nullable();

        // Indexes for better performance
        table.index(['email']);
        table.index(['phoneNumber']);
        table.index(['linkedId']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('contacts');
};
