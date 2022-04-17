// if (typeof _ === 'undefined') {
//     try {
//         var _ = require('lib/underscore');
//     } catch (e) {
//         throw new Error('Could not load underscore');
//     }
// }

/**
* JSON Database functions overview
* 
* @module TiJsonDB 
*/
export default class TiJsonDB {

    /**
     * TiJsonDB constructor
     * 
     * @param {Object} options
     * {
     *  debug: true || false,
     *  caseSensitive: true || false,
     * } 
     * 
     * @alias module:constructor
     * @returns {TiJsonDB}
     */
    constructor(options = {}) {
        this.debug = options.debug || false;
        this.caseSensitive = options.caseSensitive || false;

        this.allTables = {};

        this.query = {};
        this.query.conditions = {};
        this.entries;

        this.dbPath = this._dbPath();

        this.dbFolderObject = this._directoryObject();

        this._reloadAllTables;
        return this;
    }

    /**
     * Set actual table to fetch from
     * 
     * @alias module:TiJsonDB
     * @param {String} name 
     * @returns {TiJsonDB}
     */
    table(name) {
        if (!name) {
            throw new Error('ti-jsondb - table: No table given');
        }

        this.startTime = new Date().getTime();

        // Reset entries
        this.entries = null;

        // Reset query and conditions
        this.query = {};
        this.query.conditions = {};
        this.query.table = this._cleanString(name);

        const dbFile = Ti.Filesystem.getFile(this.dbPath, this.query.table + '.json');
        if (!dbFile.exists()) {
            if (this.debug) {
                console.log('DEBUG ti-jsondb - Table "' + this.query.table + '" does not exist and will be created');
            }
            dbFile.createFile();
            dbFile.write(JSON.stringify([]));
        }
        this._reloadAllTables;
        return this;
    }

    /**
     * Select fields to fetch from objects
     * Use * to select all fields
     * 
     * @param {String} fields Comma separated list of fields to select
     * @returns {TiJsonDb}
     */
    select(fields = '*') {
        if (!this.query.table) {
            throw new Error('ti-jsondb - select: No table given');
        }

        if (fields === '*') {
            return this;
        }

        this.query.fields = fields.split(',');

        return this;
    }

    /**
     * Simple where clause chained with AND
     * 
     * @param {String} field
     * @param {String} operator '=', '!=', '>', '<', '>=', '<=', '<>', 'like', 'not like', 'in', 'not in', 'between'
     * @param {Mixed} value
     * @returns {TiJsonDb}
     */
    where(field, operator = '=', value) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - Where: No table selected');
        }

        if (operator === 'between' && !value instanceof Array) {
            throw new Error('ti-jsondb - Where: Value for between operator on field "' + field + '" must be an array with numbers');
        }

        this.query.conditions.where = this.query.conditions.where || [];

        this.query.conditions.where.push({
            field: field,
            operator: operator,
            value: value
        });

        return this;
    }

    /**
     * Or where clause
     * Functionality is the same as where and can only be chained after where
     * 
     * @param {String} field
     * @param {String} operator '=', '!=', '>', '<', '>=', '<=', '<>', 'like', 'not like', 'in', 'not in', 'between'
     * @param {Mixed} value 
     * @returns {TiJsonDb}
     */
    orWhere(field, operator = '=', value) {
        if (!this.query.conditions.where) {
            throw new Error('ti-jsondb - orWhere: Can only be used after where');
        }

        if (!this.query.table) {
            throw new Error('ti-jsondb - orWhere: No table selected');
        }

        if (operator === 'between' && !value instanceof Array) {
            throw new Error('ti-jsondb - orWhere: Value for between operator on field "' + field + '" must be an array with numbers');
        }

        this.query.conditions.orWhere = this.query.conditions.orWhere || [];

        this.query.conditions.orWhere.push({
            field: field,
            operator: operator,
            value: value
        });

        return this;
    }

    /**
     * Simple join a table with another by field
     * 
     * @param {String} table 
     * @param {String} joinField 
     * @param {String} operator '=', '!=', '>', '<', '>=', '<=', '<>', 'like', 'not like', 'in', 'not in', 'between'
     * @param {String} onField 
     * @returns {TiJsonDb}
     */
    join(table, joinField, operator = '=', onField) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - join: No table selected');
        }

        this.query.join = this.query.join || [];

        this.query.join.push({
            table: table,
            joinField: joinField,
            operator: operator,
            onField: onField
        });

        return this;
    }

    /**
     * Order by field
     * 
     * @param {String} key 
     * @param {String} order  'asc' || 'desc' || 'rand'  
     * @returns {TiJsonDb}
     */
    orderBy(key, order = 'asc') {
        if (this.debug) {
            console.log('DEBUG ti-jsondb - Order by: ', key, order);
        }
        if (!this.query.table) {
            throw new Error('ti-jsondb - Sort: No table selected');
        }

        this.query.conditions.orderBy = {
            key: key,
            order: order
        };

        return this;
    }

    /**
     * Limits the result
     * 
     * @param {Number} limit 
     * @param {Number} offset 
     * @returns {TiJsonDb}
     */
    limit(limit = null, offset = 0) {
        if (this.debug) {
            console.log('DEBUG ti-jsondb - Limit: ', limit, offset);
        }

        if (!this.query.table) {
            throw new Error('ti-jsondb - Sort: No table selected');
        }

        this.query.conditions.limit = {
            limit: limit,
            offset: offset
        };

        return this;
    }

    /**
     * !! Warning !! 
     * 
     * This function REALLY deletes the whole table
     * 
     * @param {Function} onSuccess
     * @param {Function} onError
     * @returns {boolean}
     */
    destroy(onSuccess = null, onError = null) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - Destroy: No table selected');
        }

        if (this.allTables[this.query.table]) {
            this.allTables[this.query.table].deleteFile();
            delete this.allTables[this.query.table];
            this._reloadAllTables;

            if (this.debug) {
                console.log('DEBUG ti-jsondb - Destroy: Removed table "' + this.query.table + '"');
            }

            if (onSuccess instanceof Function) {
                onSuccess();
                return;
            }

            return true;
        }
        if (onError instanceof Function) {
            onError({error: 'Table "' + this.query.table + '" does not exist'});
            return;
        }
        return false;
    }

    /**
     * Truncate table
     * 
     * @param {Function} onSuccess 
     * @param {Function} onError 
     * @returns {boolean}
     */
    truncate(onSuccess = null, onError = null) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - Truncate: No table selected');
        }

        if (this.allTables[this.query.table]) {
            this.entries = [];

            if (this._persist()) {
                if (onSuccess instanceof Function) {
                    onSuccess(tableData);
                    return;
                }
                return true;
            }
        }

        if (onError instanceof Function) {
            onError({error: 'Table "' + this.query.table + '" does not exist'});
            return;
        }
        return false;
    }

    /**
     * Return last item
     * 
     * @param {Function} onSuccess
     * @param {Function} onError
     * @returns {Object} || function
     */
    lastItem(onSuccess = null, onError = null) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - LastItem: No table selected');
        }

        if (this.entries) {
            const lastItem = this.entries.pop();

            if (onSuccess instanceof Function) {
                onSuccess(lastItem);
                return;
            }

            return lastItem;
        }

        if (onError instanceof Function) {
            onError({error: 'No entries found in "' + this.query.table + '"'});
            return;
        }

        return null;
    }

    /**
     * Delete entries
     * Returns the number of deleted entries
     * 
     * @param {Function} onSuccess
     * @param {Function} onError
     * @returns {Number}
     */
    delete(onSuccess = null, onError = null) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - Delete: No table selected');
        }

        // Get all entries without conditions to compare
        this.query.conditions.useConditions = false;
        const allEntries = this.get();

        // Get all entries from conditions
        this.query.conditions.useConditions = true
        const filteredEntries = this.get();

        // Get the difference between all entries and filtered entries
        const difference = allEntries.filter(x => !filteredEntries.includes(x));

        let deleteCounter = allEntries.length - difference.length;
        if (this.debug) {
            console.log('DEBUG ti-jsondb - Deleted ' + deleteCounter + ' entries');
        }

        this.entries = difference;

        if (this._persist()) {
            if (onSuccess instanceof Function) {
                onSuccess(deleteCounter);
                return;
            }
            return deleteCounter;
        }
        if (onError instanceof Function) {
            onError({error: 'Could not delete objects from table "' + this.query.table + '"'});
            return;
        }
        throw new Error('ti-jsondb - Delete: Error while persisting data');
    }

    /**
     * Update entries
     * Returns the number of updated entries
     * 
     * @param {Object} tableData 
     * @param {Function} onSuccess
     * @param {Function} onError
     * @returns {Array}
     */
    update(tableData = {}, onSuccess = null, onError = null) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - Update: No table selected');
        }

        if (!tableData instanceof Object) {
            throw new Error('ti-jsondb - Update: No object provided');
        }

        // Get all entries from conditions
        this.get();

        const jsonDatabase = new TiJsonDB();
        const allEntries = jsonDatabase.table(this.query.table).get();

        let updateCounter = 0;

        if (this.entries) {
            // update this.entries
            _.each(this.entries, (entry, i) => {
                for (const [key, value] of Object.entries(entry)) {
                    if (tableData[key] !== undefined) {
                        entry[key] = tableData[key];
                    }
                }
                this.entries[i] = entry;
                updateCounter++;
            });

            // merge with allEntries
            _.each(allEntries, (entry, i) => {
                _.each(this.entries, (entry2, i2) => {
                    if (entry.id === entry2.id) {
                        allEntries[i] = entry2;
                    }
                });
            });

            this.entries = allEntries;

            if (this.debug) {
                const endTime = new Date().getTime() - this.startTime;
                console.log('DEBUG ti-jsondb - Updated ' + updateCounter + ' entrie(s) in ' + endTime + 'ms');
            }
            if (this._persist()) {
                if (onSuccess instanceof Function) {
                    onSuccess(updateCounter);
                    return;
                }
                return updateCounter;
            }
            throw new Error('ti-jsondb - Update: Error while persisting data');
        }
        if (onError instanceof Function) {
            onError({error: 'Update "' + this.query.table + '" failed'});
            return;
        }
        return false;
    }

    /**
     * Replace all data in table
     * 
     * @param {Array} tableData 
     * @param {Function} onSuccess 
     * @param {Function} onError 
     * @returns {Number}
     */
    populate(tableData, onSuccess = null, onError = null) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - Populate: No table selected');
        }

        this.truncate();
        return this.insert(tableData, onSuccess, onError);
    }

    /**
     * Insert data into table
     * Returns number of inserted entries
     * 
     * @param {Mixed} tableData Array or Object
     * @param {Function} onSuccess
     * @param {Function} onError
     * @returns {Number} 
     */
    insert(tableData, onSuccess = null, onError = null) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - Insert: No table selected');
        }

        if (!tableData) {
            throw new Error('ti-jsondb - Insert: No data to insert');
        }

        if (!tableData instanceof Object && !tableData instanceof Array) {
            throw new Error('ti-jsondb - Insert: Wrong data type provided');
        }

        if (!this.entries) {
            this.entries = this.get();
        }

        if (tableData instanceof Array) {
            _.each(tableData, (entry, i) => {

                if (tableData[i].id) {
                    if (_.findWhere(this.entries, {id: tableData[i].id})) {
                        if (onError instanceof Function) {
                            onError({table: this.query.table, error: 'Insert: ID "' + tableData[i].id + '" already exists'});
                            return;
                        }
                        throw new Error('ti-jsondb - Insert: ID "' + tableData[i].id + '" already exists');
                    }
                }

                if (!tableData[i].id) {
                    tableData[i].id = this._generateId();
                }
            });
            this.entries = this.entries.concat(tableData);
        } else {
            if (tableData.id) {
                if (_.findWhere(this.entries, {id: tableData.id})) {
                    if (onError instanceof Function) {
                        onError({table: this.query.table, error: 'Insert: ID "' + tableData.id + '" already exists'});
                        return;
                    }
                    throw new Error('ti-jsondb - Insert: ID "' + tableData.id + '" already exists');
                }
            }
            if (!tableData.id) {
                tableData.id = this._generateId();
            }
            this.entries.push(tableData);
        }

        if (this._persist()) {
            if (this.debug) {
                const endTime = new Date().getTime() - this.startTime;
                if (tableData instanceof Array) {
                    console.log('DEBUG ti-jsondb - Inserted ' + tableData.length + ' entries in ' + endTime + 'ms');
                } else {
                    console.log('DEBUG ti-jsondb - Inserted 1 entry in ' + endTime + 'ms');
                }
            }
            if (onSuccess instanceof Function) {
                onSuccess(this.entries.length);
                return;
            }

            return this.entries.length;
        }
        if (onError instanceof Function) {
            onError({table: this.query.table, error: 'Could not write objects to table "' + this.query.table + '"'});
            return;
        }
        throw new Error('ti-jsondb - Insert: Could not write object to table "' + this.query.table + '"');
    }

    /**
     * Fetch data from table
     * 
     * @param {Function} onSuccess
     * @param {Function} onError
     * @returns {Array}
     */
    get(onSuccess = null, onError = null) {

        if (!this.query.table) {
            throw new Error('ti-jsondb - Get: No table selected');
        }

        if (this.allTables[this.query.table]) {
            if (!this.entries) {
                if (this.allTables[this.query.table]) {
                    this.entries = JSON.parse(this.allTables[this.query.table].read());
                }
            }

            if (this.query.conditions.useConditions !== false) {
                /**
                 * Where
                 */
                if (this.query.conditions.where) {
                    if (this.query.conditions.where.length > 0) {
                        if (this.debug) {
                            console.log('DEBUG ti-jsondb - Get: Conditions Where', this.query.conditions.where);
                        }
                        this._where();
                    }
                }

                /**
                 * OrWhere
                 */
                if (this.query.conditions.orWhere) {
                    if (this.query.conditions.orWhere.length > 0) {
                        if (this.debug) {
                            console.log('DEBUG ti-jsondb - Get: Conditions OrWhere', this.query.conditions.where);
                        }
                        this._orWhere();
                    }
                }

                /**
                 * OrderBy
                 */
                if (this.query.conditions.orderBy) {
                    if (this.debug) {
                        console.log('DEBUG ti-jsondb - Get: Conditions OrderBy', this.query.conditions.orderBy);
                    }
                    this._orderBy();
                }

                /**
                 * Limit
                 */
                if (this.query.conditions.limit) {
                    if (this.debug) {
                        console.log('DEBUG ti-jsondb - Get: Conditions Limit', this.query.conditions.limit);
                    }
                    this._limit();
                }
            }

            if (this.debug) {
                const endTime = new Date().getTime() - this.startTime;
                console.log('DEBUG ti-jsondb - Get "' + this.query.table + '" after ' + endTime + 'ms');
            }

            /**
             * new fields to return
             */
            if (this.query.fields) {
                this.entries = _.map(this.entries, (entry) => {
                    const newEntry = {
                        id: entry.id
                    };
                    _.each(this.query.fields, (field) => {
                        field = this._trim(field);
                        if (entry[field]) {
                            newEntry[field] = entry[field];
                        }
                    });
                    return newEntry;
                });
            }

            if (onSuccess instanceof Function) {
                onSuccess(this.entries);
                return;
            }

            if (onError instanceof Function) {
                onError({table: this.query.table, message: 'Table "' + this.query.table + '" does not exist'});
                return;
            }

            return this.entries || [];
        }

        throw new Error('ti-jsondb - Get: Table "' + this.query.table + '" does not exist');
    }

    /**
     * Fetch single entry by id
     * 
     * @param {String} id 
     * @returns {Object}
     */
    getById(id) {
        if (!id) {
            throw new Error('ti-jsondb - GetById: No id provided');
        }

        return this.getSingle('id', id);
    }

    /**
     * Find entry by id
     * 
     * @param {String} id 
     * @returns {Object}
     */
    find(id) {
        return this.getSingle('id', id);
    }

    /**
     * Get last entry
     * 
     * @param {Function} onSuccess
     * @param {Function} onError
     * @returns {Object}
     */
    last(onSuccess = null, onError = null) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - Last: No table selected');
        }

        if (this.allTables[this.query.table]) {
            const entries = this._getAll();
            if (entries.length > 0) {
                return entries.pop();
            }
        }
        return null;
    }

    /**
     * Returns the first found element
     * 
     * @param {String} field 
     * @param {Mixed} value 
     * @returns {Object}
     */
    getSingle(field, value, onSuccess = null, onError = null) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - : No table selected');
        }

        if (!field) {
            throw new Error('ti-jsondb - getSingle: No field provided');
        }

        if (!value) {
            throw new Error('ti-jsondb - getSingle: No value provided');
        }

        if (this.debug) {
            console.log('DEBUG ti-jsondb - GetSingle "' + this.query.table + '" by "' + field + '" = "' + value + '"');
        }


        // if entries not set, fetch them
        this.get();

        // find entry
        let entry = _.find(this.entries, entry => {
            return entry[field] == value;
        });


        if (entry === undefined) {
            if (onError instanceof Function) {
                onError({table: this.query.table, message: 'No entry found'});
            }
            return
        }

        if (entry instanceof Array) {
            entry = entry[0];
        }

        if (onSuccess instanceof Function) {
            onSuccess(entry);
            return;
        }

        if (onError instanceof Function) {
            onError();
            return;
        }

        return entry;
    }

    /**
     * Return last item id
     * 
     * @returns {String}
     */
    get last_insert_id() {
        var lastItem = null;
        if (this.allTables[this.query.table]) {
            lastItem = this._getAll('id').pop();
        }
        if (lastItem) {
            return lastItem.id;
        }
        return null;
    }

    /**
     * Helper functions
     */

    /**
     * Returns all entries of a table
     * 
     * @private
     * @returns {Array}
     */
    _getAll(fields = '*') {
        const jsonDatabase = new TiJsonDB();
        return jsonDatabase.table(this.query.table).select(fields).get();
    }

    /**
     * Returns directory object
     * 
     * @private
     * @returns {Object}
     */
    _directoryObject() {
        const dbFolderObject = Ti.Filesystem.getFile(this.dbPath);
        if (!dbFolderObject.exists()) {
            if (!dbFolderObject.createDirectory(true)) {
                throw new Error('ti-jsondb - Could not create directory tijsondb');
            }
        }
        return dbFolderObject;
    }

    /**
     * Returns tmp directory
     * 
     * @private
     * @returns {String}
     */
    _dbPath() {
        return Ti.Filesystem.applicationDataDirectory + 'tijsondb/';
    }

    /**
     * Reload all existing tables to table -> file mapping
     * 
     * @private
     * @returns {boolean}
     */
    get _reloadAllTables() {
        let allTables = this.dbFolderObject.getDirectoryListing();
        allTables = _.filter(allTables, (table) => {
            return table.indexOf('.json') > -1;
        }).map((table) => {
            return table.replace('.json', '');
        });
        _.each(allTables, (table) => {
            this.allTables[table] = Ti.Filesystem.getFile(this.dbPath, table + '.json');
        });
        return true;
    }

    /**
     * Internal orWhere
     * 
     * @private
     * @returns {Array}
     */
    _orWhere() {
        if (this.query.conditions.orWhere) {
            if (this.query.conditions.orWhere.length > 0) {

                const jsonDatabase = new TiJsonDB();

                let conditions = [];
                _.each(this.query.conditions.orWhere, (condition) => {
                    conditions.push([condition.field, condition.operator, condition.value]);
                });

                this.entries = _.union(this.entries, jsonDatabase.table(this.query.table).where(conditions).get());

                // reset orWhere conditions
                this.query.conditions.orWhere = null;

                return this;
            }
        }
        throw new Error('ti-jsondb - OrWhere: No conditions provided');
    }

    /**
     * Internal where
     * 
     * @private
     * @returns {Array}
     */
    _where() {
        if (this.query.conditions.where) {
            if (this.query.conditions.where.length > 0) {

                if (this.entries instanceof Array) {
                    _.each(this.query.conditions.where, (where) => {
                        let field = where.field;
                        let value = where.value;
                        let operator = where.operator || '=';
                        this.entries = _.filter(this.entries, (entry) => {
                            // Check if field is set
                            if (entry[field] === undefined) {
                                return false;
                            }
                            switch (operator) {
                                case '=':
                                    if (this.caseSensitive) {
                                        return entry[field] === value;
                                    } else {
                                        return entry[field].toLowerCase() === value.toLowerCase();
                                    }
                                case '!=':
                                case '<>':
                                    if (this.caseSensitive) {
                                        return entry[field] !== value;
                                    } else {
                                        return entry[field].toLowerCase() !== value.toLowerCase();
                                    }
                                case '>':
                                    return entry[field] > value;
                                case '<':
                                    return entry[field] < value;
                                case '>=':
                                    return entry[field] >= value;
                                case '<=':
                                    return entry[field] <= value;
                                case 'in':
                                case 'like':
                                    return entry[field].indexOf(value) !== -1;
                                case 'not in':
                                case 'not like':
                                    return entry[field].indexOf(value) === -1;
                                case 'between':
                                    if (!value instanceof Array) {
                                        throw new Error('ti-jsondb - Where: Operator "' + operator + '" needs an array as value');
                                    }
                                    return entry[field] >= value[0] && entry[field] <= value[1];
                                default:
                                    throw new Error('ti-jsondb - Where: Operator "' + operator + '" not supported. Allowed operators: =, !=, <>, >, <, >=, <=, in, like, not in, not like, between');
                            }
                        });
                    });
                }

                return this;
            }
        }
        throw new Error('ti-jsondb - Where: No conditions provided');
    }

    /**
     * Internal orderBy
     * 
     * @private
     * @returns {Array}
     */
    _orderBy() {
        if (this.query.conditions.orderBy) {
            if (this.entries instanceof Array) {

                const key = this.query.conditions.orderBy.key;
                const order = this.query.conditions.orderBy.order;

                this.entries = _.filter(this.entries, (entry) => {
                    return entry[key] !== undefined;
                });

                if (order === 'rand') {
                    this.entries = _.shuffle(this.entries);
                }
                if (order === 'desc') {
                    this.entries = _.sortBy(this.entries, key).reverse();
                }
                if (order === 'asc') {
                    this.entries = _.sortBy(this.entries, key);
                }
                return this;
            }
            throw new Error('ti-jsondb - OrderBy: Table of objects "' + this.tableName + '" cannot be sorted');
        }
        throw new Error('ti-jsondb - OrderBy: No orderBy provided');
    }

    /**
     * Internal limit
     * 
     * @private
     * @returns {Array}
     */
    _limit() {
        if (this.query.conditions.limit) {
            this.entries = this.entries.slice(this.query.conditions.limit.offset, this.query.conditions.limit.limit);
            return this;
        }
    }

    /**
     * Persist data to file
     * 
     * @private
     * @returns {boolean}
     */
    _persist() {
        if (this.allTables[this.query.table].write(JSON.stringify(this.entries))) {
            return true;
        }
        return false;
    }

    /**
     * Generate a unique id
     * 
     * @private 
     * @returns GUID
     */
    _generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    }

    /**
     * Clean string from special chars
     * 
     * @private
     * @param {String} value 
     * @returns {String}
     */
    _cleanString(value) {
        if (value === undefined) {
            return '';
        }
        try {
            let endString = value.replace(/[^a-zA-Z0-9]/g, '_');
            if (endString) {
                endString = endString.toLowerCase();
            }
            return endString || '';
        } catch (e) {
            return value;
        }
    }

    /**
     * trim string
     * 
     * @private
     * @param {String} value 
     * @returns {String}
     */
    _trim(value) {
        if (value === undefined) {
            return '';
        }
        value = value || '';
        return value.replace(/^\s+|\s+$/g, '');
    }
}
