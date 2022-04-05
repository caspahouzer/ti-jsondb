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
     * @returns {TiJsonDB}
     */
    constructor(options = {}) {
        this.debug = options.debug || false;

        this.query = {};
        this.query.conditions = {};
        this.entries;

        this.dbPath = Ti.Filesystem.applicationDataDirectory + 'tijsondb/';
        console.log(this.dbPath)
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
     * @returns {TiJsonDB}
     */
    table(name) {
        if (!name) {
            throw new Error('ti-jsondb - table: No table given');
        }

        this.startTime = new Date().getTime();

        // Reset entries
        this.entries = [];

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
     * Simple where clause chained with AND
     * 
     * @param field {mixed} String || Array
     * @param operator {String} '=', '!=', '>', '<', '>=', '<=', '<>', 'like', 'not like', 'in', 'not in', 'between'
     * @param value {mixed}
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
     * @param {number} limit 
     * @param {number} offset 
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
     * @param {*} onSuccess
     * @param {*} onError
     * @returns {Boolean}
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
     * @param {*} onSuccess 
     * @param {*} onError 
     * @returns {Boolean}
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
     * 
     * @param {*} onSuccess
     * @param {*} onError
     * @returns {Boolean}
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

        if (this.debug) {
            let deleteCounter = allEntries.length - difference.length;
            console.log('DEBUG ti-jsondb - Deleted ' + deleteCounter + ' entries');
        }

        this.entries = difference;

        if (this._persist()) {
            if (onSuccess instanceof Function) {
                onSuccess(difference);
                return;
            }
            return true;
        }
        if (onError instanceof Function) {
            onError({error: 'Could not delete objects from table "' + this.query.table + '"'});
            return;
        }
        throw new Error('ti-jsondb - Delete: Error while persisting data');
    }

    /**
     * Update entries
     * 
     * @param {*} tableData 
     * @param {*} onSuccess
     * @param {*} onError
     * @returns {Array}
     */
    update(tableData = {}, onSuccess = null, onError = null) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - Update: No table selected');
        }

        // Get all entries from conditions
        this.get();

        let updateCounter = 0;

        if (this.entries) {
            _.each(this.entries, (entry, i) => {
                for (const [key, value] of Object.entries(entry)) {
                    if (tableData[key] !== undefined) {
                        entry[key] = tableData[key];
                    }
                }
                this.entries[i] = entry;
                updateCounter++;
            });
            if (this.debug) {
                const endTime = new Date().getTime() - this.startTime;
                console.log('DEBUG ti-jsondb - Updated ' + updateCounter + ' entrie(s) in ' + endTime + 'ms');
            }
            if (this._persist()) {
                if (onSuccess instanceof Function) {
                    onSuccess(this.entries);
                    return;
                }
                return this.entries;
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
     * @param {*} tableData 
     * @param {*} onSuccess 
     * @param {*} onError 
     * @returns {Array}
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
     * @returns {Array} 
     */
    insert(tableData, onSuccess = null, onError = null) {
        if (!this.query.table) {
            throw new Error('ti-jsondb - Insert: No table selected');
        }

        if (!tableData) {
            throw new Error('ti-jsondb - Insert: No data to insert');
        }

        if (tableData instanceof Array) {
            _.each(tableData, (entry, i) => {
                if (!tableData[i].id) {
                    tableData[i].id = this._generateId();
                }
            });
            this.entries = this.entries.concat(tableData);
        } else {
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
                onSuccess(tableData);
                return;
            }

            return tableData;
        }
        if (onError instanceof Function) {
            onError({error: 'Could not write objects to table "' + this.query.table + '"'});
            return;
        }
        throw new Error('ti-jsondb - Insert: Could not write object to table "' + this.query.table + '"');
    }

    /**
     * Fetch data from table
     * 
     * @param {*} onSuccess
     * @param {*} onError
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

            if (onSuccess instanceof Function) {
                onSuccess(this.entries);
                return;
            }

            if (onError instanceof Function) {
                onError({message: 'Table "' + this.query.table + '" does not exist'});
                return;
            }

            return this.entries || [];
        }

        throw new Error('ti-jsondb - Get: Table "' + this.query.table + '" does not exist');
    }

    /**
     * Fetch single entry by id
     * 
     * @param {string} id 
     * @returns {Object}
     */
    getById(id) {
        if (!id) {
            throw new Error('ti-jsondb - GetById: No id provided');
        }

        return this.getSingle('id', id);
    }

    /**
     * Returns the first found element
     * 
     * @param {string} field 
     * @param {mixed} value 
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

        // if entries not set, fetch them
        if (!this.entries) {
            this.get();
        }

        // find entry
        let entry = _.find(this.entries, (entry) => {
            return entry[field] === value;
        });

        if (this.debug) {
            console.log('DEBUG ti-jsondb - Fetch single from "' + field + '" by "' + value + '"');
        }

        if (entry === undefined) {
            if (onError instanceof Function) {
                onError({message: 'No entry found'});
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
     * @returns {Boolean}
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
                                    case '<>':
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
                                        if (!value instanceof Array) {
                                            throw new Error('ti-jsondb - Where: Operator "' + operator + '" needs an array as value');
                                        }
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
     * @returns {Boolean}
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
            let endString = value.replace(/[^a-zA-Z0-9]/g, '_');
            if (endString) {
                endString = endString.toLowerCase();
            }
            return endString || '';
        } catch (e) {
            return value;
        }
    }
}