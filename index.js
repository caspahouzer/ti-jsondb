/**
 * Database functions overview
 * 
 * @module TiJsonDB
 */
export default class TiJsonDB {

    /**
     * Creates path for table files
     * 
     * @alias module:constructor
     * @returns TiJsonDB
     */
    constructor(options = {}) {
        this.debug = options.debug || false;
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

        this.reloadAllTables;
        return this;
    }

    /**
     * Set actual table to fetch from
     * 
     * @alias module:TiJsonDB
     * @param {*} tableName 
     * @param {*} tableData optional 
     * @returns TiJsonDB
     */
    table(tableName, tableData) {
        this.entries = null;
        this.dbTable = tableName;
        const dbFile = Ti.Filesystem.getFile(this.dbPath, this._cleanString(this.dbTable) + '.json');
        if (!dbFile.exists()) {
            if (this.debug) {
                console.log('DEBUG ti-jsondb - Table "' + this.dbTable + '" does not exist and will be created');
            }
            dbFile.createFile();
            dbFile.write(JSON.stringify([]));
            this.reloadAllTables;
        }

        if (tableData) {
            dbFile.write(JSON.stringify(tableData));
        }
        this.fetch();
        return this;
    }

    /**
     * Push data to table
     * 
     * @param {*} tableData 
     * @returns Array || Error
     */
    push(tableData) {
        if (this.debug) {
            console.log('DEBUG ti-jsondb - Push ', tableData);
        }
        if (!this.dbTable) {
            throw new Error('ti-jsondb - Push: No table selected');
        }

        if (this.allTables[this.dbTable]) {
            let entries = this.fetch();

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
                        return tableData;
                    }
                    throw new Error('ti-jsondb - Push: Could not write object to table "' + this.dbTable + '"');
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
                        return tableData;
                    }
                    throw new Error('ti-jsondb - Push: Could not write objects to table "' + this.dbTable + '"');
                }
            }

            // Persist object in table
            if (tableData instanceof Object) {
                _.each(tableData, (value, key) => { entries[key] = value; });
                this.entries = entries;
                if (this._persist()) {
                    return tableData;
                }
            }
        }
        throw new Error('ti-jsondb - Push: Table "' + this.dbTable + '" does not exist');
    }

    /**
     * Fetch data from table
     * 
     * @param {*} onSuccess
     * @param {*} onError
     * @returns Array || Error
     */
    fetch(onSuccess = null, onError = null) {

        if (!this.dbTable) {
            throw new Error('ti-jsondb - Fetch: No table selected');
        }

        if (this.debug) {
            const endTime = new Date().getTime() - this.startTime;
            console.log('DEBUG ti-jsondb - Fetch after ' + endTime + 'ms');
        }

        if (this.entries) {
            if (onSuccess instanceof Function) {
                onSuccess(this.entries);
                return;
            }

            return this.entries;
        }

        if (this.allTables[this.dbTable]) {
            this.entries = JSON.parse(this.allTables[this.dbTable].read());

            if (onSuccess instanceof Function) {
                onSuccess(this.entries);
                return;
            }
            return this.entries;
        }

        if (onError instanceof Function) {
            onError({ message: 'Table "' + this.dbTable + '" does not exist' });
            return;
        }

        throw new Error('ti-jsondb - Push: Table "' + this.dbTable + '" does not exist');
    }

    /**
     * Fetch single entry by id
     * 
     * @param {string} id 
     * @returns Object || Error
     */
    fetchById(id, onSuccess = null, onError = null) {
        return this.fetchSingle('id', id, onSuccess = null, onError = null);
    }

    /**
     * Returns the first found element
     * 
     * @param {string} field 
     * @param {mixed} value 
     * @returns Object || Error
     */
    fetchSingle(field, value, onSuccess = null, onError = null) {
        if (!this.dbTable) {
            throw new Error('ti-jsondb - : No table selected');
        }

        // if entries not set, fetch them
        if (!this.entries) {
            this.fetch();
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
     * Simple where clauses
     * 
     * {
     *  field: 'first_name',
     *  value: 'Jane',
     *  operator: "= | != | > | < | >= | <= | in | not in | like | not like"
     * }
     * 
     * OR for multiple where clauses combinded with AND
     * 
     * [
     *  {
     *    field: 'first_name',
     *    value: 'Jane',
     *    operator: "= | != | > | < | >= | <= | in | not in | like | not like"
     *  },
     *  {
     *    field: 'last_name',
     *    value: 'Doe',
     *    operator: "= | != | > | < | >= | <= | in | not in | like | not like"
     *  }
     * ]
     * 
     * @param {Object} whereClause
     * @returns Array || Error
     */
    where(whereClause = []) {
        if (!this.dbTable) {
            throw new Error('ti-jsondb - Where: No table selected');
        }

        if (this.allTables[this.dbTable]) {
            if (this.entries) {
                _.each(whereClause, (where) => {
                    let field = where.field;
                    let value = where.value;
                    let operator = where.operator || '=';
                    this.entries = _.filter(this.entries, (entry) => {
                        // Check if field is set
                        if(entry[field] === undefined){
                            return false;
                        }
                        switch (operator) {
                            case '=':
                                return entry[field].toLowerCase() === value.toLowerCase();
                                break;
                            case '!=':
                                return entry[field].toLowerCase() !== value.toLowerCase();
                                break;
                            case '>':
                                return entry[field] > value;
                                break;
                            case '<':
                                return entry[field] < value;
                                break;
                            case '>=':
                                return entry[field] >= value;
                                break;
                            case '<=':
                                return entry[field] <= value;
                                break;
                            case 'in':
                            case 'like':
                                return entry[field].indexOf(value) !== -1;
                                break;
                            case 'not in':
                            case 'not like':
                                return entry[field].indexOf(value) === -1;
                                break;
                            default:
                                throw new Error('ti-jsondb - Where: Operator "' + operator + '" not supported');
                        }
                    });
                });
            }
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
        if (!this.dbTable) {
            throw new Error('ti-jsondb - Sort: No table selected');
        }

        if (!this.entries) {
            this.entries = this.fetch();
        }

        if (this.entries instanceof Array) {

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

        if (!this.dbTable) {
            throw new Error('ti-jsondb - Sort: No table selected');
        }

        if (!this.entries) {
            this.entries = this.fetch();
        }

        this.entries = this.entries.slice(offset, limit);

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

        if (!this.dbTable) {
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
                onSuccess({ id: id });
                return;
            }

            return this._persist();
        }
        if (onError instanceof Function) {
            if (id instanceof Array) {
                onError(id);
                return;
            }
            onError({ id: id });
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
        if (!this.dbTable) {
            throw new Error('ti-jsondb - Destroy: No table selected');
        }

        if (this.allTables[this.dbTable]) {
            this.allTables[this.dbTable].deleteFile();
            delete this.allTables[this.dbTable];
            this.reloadAllTables;

            if (onSuccess instanceof Function) {
                onSuccess();
                return;
            }

            return true;
        }
        if (onError instanceof Function) {
            onError();
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
        if (!this.dbTable) {
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
            onError();
            return;
        }

        return null;
    }

    /**
     * Return last item id
     * 
     * @returns {string}
     */
    get last_insert_id() {
        const lastItem = this.lastItem();
        if(lastItem) {
            return lastItem.id;
        }
        return null;
    }

    /**
     * Reload all existing tables to table -> file mapping
     * 
     * @returns {boolean}
     */
    get reloadAllTables() {
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
     * Helper functions
     */

    /**
     * Persist data to file
     * 
     * @private
     * @returns {boolean}
     */
    _persist() {
        if (this.allTables[this.dbTable].write(JSON.stringify(this.entries))) {
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
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
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
    };
}