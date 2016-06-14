'use strict'

/**
 * Dependencies
 */
const JSONPatch = require('./JSONPatch')

/**
 * Model
 *
 * @class
 * Model is a high level interface that binds together all other features of
 * this package and provides the principle method of data modeling.
 */
class Model {

  /**
   * Schema
   */
  static get schema () {
    throw new Error('Schema must be defined by classes extending Model')
  }

  /**
   * Constructor
   *
   * @param {Object} data
   * @param {Object} options
   */
  constructor (data = {}, options = {}) {
    this.initialize(data, options)
  }

  /**
   * Initialize
   *
   * @param {Object} data
   * @param {Object} options
   */
  initialize (data = {}, options = {}) {
    let {constructor: {schema}} = this
    schema.initialize(this, data, options)
  }

  /**
   * Validate
   *
   * @param {JSONSchema} alternate - OPTIONAL alternate schema
   * @returns {Object}
   */
  validate (alternate) {
    let {constructor: {schema}} = this
    return (alternate || schema).validate(this)
  }

  /**
   * Patch
   *
   * @param {Array} ops
   */
  patch (ops) {
    let patch = new JSONPatch(ops)
    patch.apply(this)
  }

  /**
   * Select
   */
  select () {}

  /**
   * Project
   *
   * @description
   * Given a mapping, return an object projected from the current instance.
   *
   * @example
   * let schema = new JSONSchema({
   *   properties: {
   *     foo: { type: 'Array' }
   *   }
   * })
   *
   * let mapping = new JSONMapping({
   *   '/foo/0': '/bar/baz'
   * })
   *
   * class FooTracker extends Model {
   *   static get schema () { return schema }
   * }
   *
   * let instance = new FooTracker({ foo: ['qux'] })
   * instance.project(mapping)
   * // => { bar: { baz: 'qux' } }
   *
   * @param {JSONMapping} mapping
   * @return {Object}
   */
  project (mapping) {
    return mapping.project(this)
  }

  /**
   * Serialize
   *
   * @param {Object} object
   * @returns {string}
   */
  static serialize (object) {
    return JSON.stringify(object)
  }

  /**
   * Deserialize
   *
   * @param {string} data
   * @return {*}
   */
  static deserialize (data) {
    try {
      return JSON.parse(data)
    } catch (e) {
      throw new Error('Failed to parse JSON')
    }
  }

}

/**
 * Export
 */
module.exports = Model
