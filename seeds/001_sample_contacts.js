/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('contacts').del()
        .then(function () {
            // Inserts seed entries
            return knex('contacts').insert([
                {
                    email: 'john.doe@example.com',
                    phoneNumber: '+1234567890',
                    linkPrecedence: 'primary',
                    linkedId: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);
        });
};
