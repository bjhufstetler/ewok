/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('satenv', table => {
    table.increments();
    table.string('server', 4);
    table.string('conn', 10);
    table.string('team', 20);
    table.double('cf');
    table.double('dr');
    table.integer('mod');
    table.integer('fec');
    table.double('power');
    table.string('band', 5);
    table.string('sat', 10);
    table.string('feed', 45);
    table.string('stage', 4);
    table.boolean('lb');
    table.boolean('active');

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('satenv');
};
