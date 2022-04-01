# ti.jsondb

## A file based JSON database for TiDev Titanium

### Install

Follow these [guidelines](https://titaniumsdk.com/guide/Titanium_SDK/Titanium_SDK_Guide/Best_Practices_and_Recommendations/CommonJS_Modules_in_Titanium.html#commonjs-module-specification-implementation) to know how Titanium handles to work with node modules

    npm install @caspahouzer/ti-jsondb

### Inititate the database

```javascript
import TiJsonDB from '@caspahouzer/ti-jsondb';
const jsonDatabase = new TiJsonDB({
    debug: true,
});
```

### Working with the database

#### Create / Init table
```javascript
jsonDatabase.table('user');
```

#### Create example settings table with object content
```javascript
jsonDatabase.table('settings', { setting1: true, setting2: false, setting3: 'test' });
let settings = jsonDatabase.table('settings').fetch();
console.warn('settings', settings);
```

#### Update object
```javascript
jsonDatabase.table('settings').push({ setting1: false, setting2: true });
settings = jsonDatabase.table('settings').fetch();
console.warn('settings after update', settings);
```

#### Push data into table
```javascript
jsonDatabase.table('user').push({
    id: '38414679-1a10-42fe-be65-8e6b0b37b234', // remove this line to make a new entry
    first_name: 'John',
    last_name: 'Doe',
    gender: 'Male',
    email: 'john.doe@example.com',
});
```

#### Delete table completely
```javascript
jsonDatabase.table('test');
jsonDatabase.table('test').destroy();
```

#### Push item for delete action
```javascript
jsonDatabase.table('user').push({
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
    .fetch()
    .forEach((entry) => {
        // console.warn('entry', entry);
    });
```

#### Delete item by id
```javascript
jsonDatabase.table('user').delete('b8b79689-39a5-4885-80d8-9b8822e061c5');
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
    .fetch(
        (success = (data) => {
            if (data.length > 0) {
                console.warn('success', data[0]);
                return;
            }
            console.warn('no entries found');
        }),
        (error = (error) => {
            console.warn('error', error);
        })
    );
```

#### Fetch a single item by id
```javascript
jsonDatabase.table('user').fetchById(
    '38414679-1a10-42fe-be65-8e6b0b37b234',
    (success = (data) => {
        console.warn('onSuccess', data);
    })
);
```

#### Fetch single item by field
```javascript
jsonDatabase.table('user').fetchSingle(
    'first_name',
    'Jane',
    (success = (data) => {
        console.warn('onSuccess', data);
    })
);
```
#### Simple where clause
```javascript
jsonDatabase
    .table('user')
    .where([
        {
            field: 'first_name',
            operator: '=',
            value: 'Jane',
        },
    ])
    .fetch(
        (success = (data) => {
            console.warn('onSuccess', data);
        })
    );
```

#### Simple where clause with limit
```javascript
jsonDatabase
    .table('user')
    .where([
        {
            field: 'first_name',
            operator: 'like',
            value: 'Jane',
        },
    ])
    .limit(10)
    .orderBy('first_name', 'desc')
    .fetch(
        (success = (data) => {
            console.warn('onSuccess', data);
        })
    );
```
Get an [overview](./database.md) to all functions and parameters

&copy; 2022 Sebastian Klaus