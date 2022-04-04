/**
 * JSON Database functions overview
 * 
 * @module TiJsonDB
 */
export default class TiJsonDB {

    /**
     * TiJsonDB constructor
     * 
     * @param {object} options
     * {
     *  debug: true || false,
     * }
     * 
     * @alias module:constructor
     * @returns TiJsonDB
     */
    constructor(options = {}) {
        this.debug = options.debug || false;

        this.query = {};
        this.query.conditions = {};
        this.entries;

        this.startTime = new Date().getTime();

        this.dbPath = Ti.Filesystem.applicationDataDirectory + 'tijsondb/';
        this.dbFolderObject = Ti.Filesystem.getFile(this.dbPath);
        this.allTables = {};
        if (!this.dbFolderObject.exists()) {
            if (!this.dbFolderObject.createDirectory(true)) {
                throw new Error('ti-jsondb - Could not create directory tijsondb');
            }
        }

        this._reloadAllTables;
        return this;
    }

    /**
     * Set actual table to fetch from
     * 
     * @alias module:TiJsonDB
     * @param {*} name 
     * @returns TiJsonDB
     */
    table(name) {
        if (!name) {
            throw new Error('ti-jsondb - table: No table given');
        }

        // Reset entries
        this.entries = null;

        // Reset query and conditions
        this.query = {};
        this.query.conditions = {};
        this.query.table = name.replace(/[^a-zA-Z]/g, '');

        const dbFile = Ti.Filesystem.getFile(this.dbPath, this._cleanString(this.query.table) + '.json');
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
     * Simple where clause chained with AND
     * 
     * @param field {mixed} String || Array
     * @param operator {String} '=', '!=', '>', '<', '>=', '<=', 'like', 'not like', 'in', 'not in', 'between'
     * @param value {mixed}
     * @returns Array || Error
     */
    where(field, operator = '=', value) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - Where: No table selected');
        }

        if (operator === 'between' && !value instanceof Array) {
            throw new Error('ti-jsondb - Where: Value for between operator on field "' + field + '" must be an array with numbers');
        }

        this.query.conditions.where = this.query.conditions.where || [];

        if (field instanceof Array) {
            _.each(field, (n) => {
                console.log(n);
                this.query.conditions.where.push({
                    field: n[0],
                    operator: n[1],
                    value: n[2]
                });
            });
        } else {
            this.query.conditions.where.push({
                field: field,
                operator: operator,
                value: value
            });
        }

        return this;
    }

    /**
     * Order by field
     * 
     * @param {*} key 
     * @param {*} order  'asc' || 'desc' || 'rand'  
     * @returns Array || Error
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
     * @param {number} limit 
     * @param {number} offset 
     * @returns Array || Error
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
     * Delete item by id
     * 
     * @param {mixed} String || Array id
     * @param {*} onSuccess
     * @param {*} onError
     * @returns {boolean} || function
     */
    delete(id, onSuccess = null, onError = null) {
        if (!id) {
            throw new Error('ti-jsondb - Delete: No id given');
        }

        if (!this.query.table) {
            throw new Error('ti-jsondb - Delete: No table selected');
        }

        if (this.entries) {
            let deletedEntries = this.entries.length;
            if (this.debug) {
                console.log('DEBUG ti-jsondb - Delete ', id);
            }

            this.entries = _.filter(this.entries, (n) => {
                if (id instanceof Array) {
                    return _.indexOf(id, n.id) === -1;
                }

                return n.id !== id;
            });

            if (this.debug) {
                deletedEntries -= this.entries.length;
                console.log('DEBUG ti-jsondb - Deleted ' + deletedEntries + ' item(s) of ', this.entries.length);
            }

            this._persist();

            if (onSuccess instanceof Function) {
                if (id instanceof Array) {
                    onSuccess(id);
                    return;
                }
                onSuccess({id: id});
                return;
            }

            return this._persist();
        }
        if (onError instanceof Function) {
            if (id instanceof Array) {
                onError(id);
                return;
            }
            onError({id: id, message: 'ti-jsondb - Delete: No item found with id "' + id + '"'});
            return;
        }

        return false;
    }

    /**
     * !! Warning !! 
     * 
     * This function REALLY deletes the whole table
     * 
     * @param {*} onSuccess
     * @param {*} onError
     * @returns {boolean} || function
     */
    destroy(onSuccess = null, onError = null) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - Destroy: No table selected');
        }

        if (this.allTables[this.query.table]) {
            this.allTables[this.query.table].deleteFile();
            delete this.allTables[this.query.table];
            this._reloadAllTables;

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
     * @param {*} onSuccess 
     * @param {*} onError 
     * @returns {boolean} || function
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
     * @param {*} onSuccess
     * @param {*} onError
     * @returns {object} || function
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
     * Update table data
     * 
     * @param {*} tableData 
     * @param {*} onSuccess
     * @param {*} onError
     * @returns Array || Error
     */
    update(tableData = {}, onSuccess = null, onError = null) {
        this.insert(tableData, onSuccess, onError);
    }

    /**
     * Replace all data in table
     * 
     * @param {*} tableData 
     * @param {*} onSuccess 
     * @param {*} onError 
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
     * 
     * @param {*} tableData 
     * @param {*} onSuccess
     * @param {*} onError
     * @returns Array || Error
     */
    insert(tableData, onSuccess = null, onError = null) {
        if (this.debug) {
            console.log('DEBUG ti-jsondb - Insert ', tableData);
        }
        if (!this.query.table) {
            throw new Error('ti-jsondb - Insert: No table selected');
        }

        if (!tableData) {
            throw new Error('ti-jsondb - Insert: No data to push');
        }

        if (this.allTables[this.query.table]) {
            let entries = this.get();

            // add/update item:s in Array
            if (entries instanceof Array) {

                // Add single object
                if (tableData instanceof Object) {
                    let entryExists = false;
                    if (tableData.id) {
                        _.each(entries, (entry, i) => {
                            if (entry.id === tableData.id) {
                                entries[i] = tableData;
                                entryExists = true;
                            }
                        });
                    } else {
                        tableData.id = this._generateId();
                    }
                    if (entryExists === false) {
                        entries.push(tableData);
                    }

                    this.entries = entries;

                    if (this._persist()) {
                        if (onSuccess instanceof Function) {
                            onSuccess(tableData);
                            return;
                        }

                        return tableData;
                    }
                    if (onError instanceof Function) {
                        onError({error: 'Could not write objects to table "' + this.query.table + '"'});
                        return;
                    }
                    throw new Error('ti-jsondb - Push: Could not write object to table "' + this.query.table + '"');
                }

                // Add array of objects
                if (tableData instanceof Array) {
                    _.each(tableData, (data) => {

                        if (data instanceof Object) {
                            let entryExists = false;
                            if (data.id) {
                                _.each(entries, (entry, i) => {
                                    if (entry.id === data.id) {
                                        entries[i] = data;
                                        entryExists = true;
                                    }
                                });
                            } else {
                                data.id = this._generateId();
                            }
                            if (entryExists === false) {
                                entries.push(data);
                            }

                        }

                    });
                    this.entries = entries;
                    if (this._persist()) {
                        if (onSuccess instanceof Function) {
                            onSuccess(tableData);
                            return;
                        }

                        return tableData;
                    }
                    if (onError instanceof Function) {
                        onError({error: 'Could not write objects to table "' + this.query.table + '"'});
                        return;
                    }
                    throw new Error('ti-jsondb - Push: Could not write objects to table "' + this.query.table + '"');
                }
            }

            // Persist object in table
            if (tableData instanceof Object) {
                _.each(tableData, (value, key) => {entries[key] = value;});
                this.entries = entries;
                if (this._persist()) {
                    return tableData;
                }
            }
        }
        throw new Error('ti-jsondb - Insert: Table "' + this.query.table + '" does not exist');
    }

    /**
     * Fetch data from table
     * 
     * @param {*} onSuccess
     * @param {*} onError
     * @returns Array || Error
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

            if (this.debug) {
                const endTime = new Date().getTime() - this.startTime;
                console.log('DEBUG ti-jsondb - Get "' + this.query.table + '" after ' + endTime + 'ms');
            }

            if (onSuccess instanceof Function) {
                onSuccess(this.entries);
                return;
            }

            if (onError instanceof Function) {
                onError({message: 'Table "' + this.query.table + '" does not exist'});
                return;
            }

            return this.entries;
        }

        throw new Error('ti-jsondb - Get: Table "' + this.query.table + '" does not exist');
    }

    /**
     * Fetch single entry by id
     * 
     * @param {string} id 
     * @returns Object || Error
     */
    getById(id, onSuccess = null, onError = null) {
        return this.getSingle('id', id, onSuccess = null, onError = null);
    }

    /**
     * Returns the first found element
     * 
     * @param {string} field 
     * @param {mixed} value 
     * @returns Object || Error
     */
    getSingle(field, value, onSuccess = null, onError = null) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - : No table selected');
        }

        // if entries not set, fetch them
        if (!this.entries) {
            this.get();
        }

        // find entry
        let entry = _.find(this.entries, (entry) => {
            return entry[field] === value;
        });

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

        if (this.debug) {
            console.log('DEBUG ti-jsondb - Fetch single from "' + field + '" by "' + value + '": ', entry);
        }

    }

    /**
     * Return last item id
     * 
     * @returns {string}
     */
    get last_insert_id() {
        const lastItem = this.lastItem();
        if (lastItem) {
            return lastItem.id;
        }
        return null;
    }

    /**
     * Helper functions
     */

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
     * Internal where
     * 
     * @private
     * @returns {Array}
     */
    _where() {
        if (this.query.conditions.where) {
            if (this.query.conditions.where.length > 0) {

                if (this.allTables[this.query.table]) {
                    if (this.entries) {
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
                                        return entry[field].toLowerCase() === value.toLowerCase();
                                    case '!=':
                                        return entry[field].toLowerCase() !== value.toLowerCase();
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
                                        return entry[field] >= value[0] && entry[field] <= value[1];
                                    default:
                                        throw new Error('ti-jsondb - Where: Operator "' + operator + '" not supported');
                                }

                            });
                        });
                    }
                }

                return this;
            }
        }
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
            throw new Error('ti-jsondb - Sort: Table of objects "' + this.tableName + '" cannot be sorted');
        }
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
     * @param {*} value 
     * @returns {string}
     */
    _cleanString(value) {
        if (value === undefined) {
            return '';
        }
        try {
            let endString = value.replace(/[^a-zA-Z0-9\/.]/g, '_');
            if (endString) {
                endString = endString.toLowerCase();
            }
            return endString || '';
        } catch (e) {
            return value;
        }
    }
}