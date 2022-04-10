# ti.jsondb

## A file based JSON database for TiDev Titanium

### Install node module

Follow these [guidelines](https://titaniumsdk.com/guide/Titanium_SDK/Titanium_SDK_Guide/Best_Practices_and_Recommendations/CommonJS_Modules_in_Titanium.html#commonjs-module-specification-implementation) to know how Titanium handles to work with node modules

    npm install @caspahouzer/ti-jsondb

### Inititate the database as node module

> You can also use that as a normal **/lib** file.

To do that, copy [ti-jsondb.js](ti-jsondb.js) to `lib/ti-jsondb.js`

> &nbsp;
 ❗️ Warning
 ti-jsondb is made for [Alloy](https://titaniumsdk.com/guide/Alloy_Framework/) and uses [underscore.js](http://underscorejs.org).
 If you want to use it in a classic project, what is **not** the state of art, copy [underscore.js](lib/underscore.js) to `lib/underscore.js`
 &nbsp;

```javascript
// Node module
import TiJsonDB from '@caspahouzer/ti-jsondb';
// ES6+
import TiJsonDB from 'ti-jsondb';
```

Now, create a new instance of _TiJsonDB_

```javascript
const jsonDatabase = new TiJsonDB({
    // Show debug information
    debug: true,
    // Handle where clause case sensitive
    caseSensitive: false,
});
```

### Working with the database

#### Create / Init table

```javascript
let user = jsonDatabase.table('user');
let settings = jsonDatabase.table('settings');
```

#### Truncate table

```javascript
jsonDatabase.table('settings').truncate();
```

#### Create example settings table with object content

```javascript
// Insert and return
settings = jsonDatabase.table('settings').insert({ id: 'settings', setting1: true, setting2: false, setting3: 'test' });

// get all entries
settings = jsonDatabase.table('settings').find('settings');
console.warn('settings', settings);
```

#### Update object

```javascript
jsonDatabase.table('settings').update({ id: 'settings', setting1: false, setting2: true });
settings = jsonDatabase.table('settings').get();
console.warn('settings after update', settings);
```

#### Push data into table

```javascript
jsonDatabase.table('user').insert({
    id: '38414679-1a10-42fe-be65-8e6b0b37b234', // remove this line to make a new entry
    first_name: 'John',
    last_name: 'Doe',
    gender: 'Male',
    email: 'john.doe@example.com',
});
console.warn('Last inserted id', jsonDatabase.last_insert_id);
```

#### Delete table completely

```javascript
jsonDatabase.table('test').destroy();
```

#### Push item for delete action

```javascript
jsonDatabase.table('user').insert({
    id: 'b8b79689-39a5-4885-80d8-9b8822e061c5',
    first_name: 'Jane',
    last_name: 'Doe',
    gender: 'Female',
    email: 'jane.doe@example.com',
});
```

#### Fetch table

```javascript
jsonDatabase
    .table('user')
    .orderBy('name', 'ASC')
    .get()
    .forEach((entry) => {
        console.warn('entry', entry);
    });
```

#### Select fields to return in object

```javascript
jsonDatabase
    .table('user')
    .select('first_name, last_name')
    .orderBy('first_name', 'desc')
    .limit(10)
    .get((data) => {
        if (data.length > 0) {
            console.warn('success select', data);
            return;
        }
        console.warn('no entries found');
    });
```

#### Delete item by id

```javascript
jsonDatabase.table('user').where('id', '=', 'b8b79689-39a5-4885-80d8-9b8822e061c5').delete();
```

#### Delete multiple items

```javascript
jsonDatabase.table('user').delete(['b8b79689-39a5-4885-80d8-9b8822e061c5', 'd6c52967-9654-4152-80f8-8fbc5a1e33d6']);
```

#### fetch data with callback functions

```javascript
jsonDatabase
    .table('user')
    .orderBy('first_name', 'rand')
    .get(
        (data) => {
            if (data.length > 0) {
                console.warn('success', data[0]);
                return;
            }
            console.warn('no entries found');
        }),
        (error) => {
            console.warn('error', error);
        })
    );
```

#### Fetch a single item by id

```javascript
const singleUser = jsonDatabase.table('user').find('d6c52967-9654-4152-80f8-8fbc5a1e33d6');
console.warn('singleUser', singleUser);
```

#### Fetch single item by field

```javascript
jsonDatabase.table('user').getSingle(
    'first_name',
    'Jane',
    (data) => {
        console.warn('success getSingle', data);
    },
    (error) => {
        console.warn('error getSingle', error);
    }
);
```

#### Simple where clause

```javascript
jsonDatabase
    .table('user')
    .where('first_name', '=', 'Jane')
    .get((data) => {
        console.warn('success simple where', data);
    });
```

#### Simple where like clause with limit

```javascript
jsonDatabase
    .table('user')
    .where('first_name', 'like', 'Joh')
    .limit(10)
    .orderBy('first_name', 'desc')
    .get((data) => {
        console.warn('success simple where with limit', data);
    });
```

#### Chained where clause

```javascript
jsonDatabase
    .table('user')
    .where('last_name', 'like', 'Min')
    .where('first_name', '=', 'Etan')
    .limit(10)
    .orderBy('first_name', 'desc')
    .get((data) => {
        console.warn('success chained where clause', data);
    });
```

#### orWhere clause

The orWhere clause has be set **after** _where_ clause and can be used like the _where_ function. Give an array to handle multiple wheres which are combined with _AND_

```javascript
jsonDatabase
    .table('user')
    .where('first_name', 'like', 'Ja')
    .orWhere('last_name', '=', 'Doe')
    .orderBy('first_name')
    .get((data) => {
        console.warn('success where array and chained orWhere', data);
    });
```

#### Update multiple entries

```javascript
jsonDatabase.table('user')
    .where('first_name', 'like', 'John')
    .limit(10)
    .update({ first_name: 'Johny' },
    success = (counter){
        console.log('Updated '+counter+' entries')
    });
```

#### Delete entries

```javascript
jsonDatabase.table('user')
    .where('first_name', 'like', 'John')
    .delete(
    success = (counter){
        console.log('Deleted '+counter+' entries')
    });
```

Get an [overview](./methods.md) to all functions and parameters

---

&copy; 2022 Sebastian Klaus
