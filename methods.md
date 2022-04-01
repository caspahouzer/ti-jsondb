<a name="module_TiJsonDB"></a>

## TiJsonDB
Database functions overview


* [TiJsonDB](#module_TiJsonDB)
    * [table(tableName, tableData)](#exp_module_TiJsonDB--table) ⇒ ⏏
        * [.last_insert_id](#module_TiJsonDB--table+last_insert_id) ⇒ <code>string</code>
        * [.reloadAllTables](#module_TiJsonDB--table+reloadAllTables) ⇒ <code>boolean</code>
        * [.push(tableData)](#module_TiJsonDB--table+push) ⇒
        * [.fetch(onSuccess, onError)](#module_TiJsonDB--table+fetch) ⇒
        * [.fetchById(id)](#module_TiJsonDB--table+fetchById) ⇒
        * [.fetchSingle(field, value)](#module_TiJsonDB--table+fetchSingle) ⇒
        * [.where(whereClause)](#module_TiJsonDB--table+where) ⇒
        * [.orderBy(key, order)](#module_TiJsonDB--table+orderBy) ⇒
        * [.limit(limit, offset)](#module_TiJsonDB--table+limit) ⇒
        * [.delete(String, onSuccess, onError)](#module_TiJsonDB--table+delete) ⇒ <code>boolean</code>
        * [.destroy(onSuccess, onError)](#module_TiJsonDB--table+destroy) ⇒ <code>boolean</code>
        * [.lastItem(onSuccess, onError)](#module_TiJsonDB--table+lastItem) ⇒ <code>object</code>

<a name="exp_module_TiJsonDB--table"></a>

### table(tableName, tableData) ⇒ ⏏
Set actual table to fetch from

**Kind**: Exported function  
**Returns**: TiJsonDB  

| Param | Type | Description |
| --- | --- | --- |
| tableName | <code>\*</code> |  |
| tableData | <code>\*</code> | optional |

<a name="module_TiJsonDB--table+last_insert_id"></a>

#### table.last\_insert\_id ⇒ <code>string</code>
Return last item id

**Kind**: instance property of [<code>table</code>](#exp_module_TiJsonDB--table)  
<a name="module_TiJsonDB--table+reloadAllTables"></a>

#### table.reloadAllTables ⇒ <code>boolean</code>
Reload all existing tables to table -> file mapping

**Kind**: instance property of [<code>table</code>](#exp_module_TiJsonDB--table)  
<a name="module_TiJsonDB--table+push"></a>

#### table.push(tableData) ⇒
Push data to table

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: Array || Error  

| Param | Type |
| --- | --- |
| tableData | <code>\*</code> | 

<a name="module_TiJsonDB--table+fetch"></a>

#### table.fetch(onSuccess, onError) ⇒
Fetch data from table

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: Array || Error  

| Param | Type | Default |
| --- | --- | --- |
| onSuccess | <code>\*</code> | <code></code> | 
| onError | <code>\*</code> | <code></code> | 

<a name="module_TiJsonDB--table+fetchById"></a>

#### table.fetchById(id) ⇒
Fetch single entry by id

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: Object || Error  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="module_TiJsonDB--table+fetchSingle"></a>

#### table.fetchSingle(field, value) ⇒
Returns the first found element

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: Object || Error  

| Param | Type |
| --- | --- |
| field | <code>string</code> | 
| value | <code>mixed</code> | 

<a name="module_TiJsonDB--table+where"></a>

#### table.where(whereClause) ⇒
Simple where clauses

[{
 field: 'first_name',
 value: 'Jane',
 operator: "= | != | > | < | >= | <= | in | not in | like | not like"
}]

OR for multiple where clauses combinded with AND

[{
   field: 'first_name',
   value: 'Jane',
   operator: "= | != | > | < | >= | <= | in | not in | like | not like"
 },
 {
   field: 'last_name',
   value: 'Doe',
   operator: "= | != | > | < | >= | <= | in | not in | like | not like"
 }]

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: Array || Error  

| Param | Type |
| --- | --- |
| whereClause | <code>Array</code> | 

<a name="module_TiJsonDB--table+orderBy"></a>

#### table.orderBy(key, order) ⇒
Order by field

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: Array || Error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>\*</code> |  |  |
| order | <code>\*</code> | <code>asc</code> | 'asc' || 'desc' || 'rand' |

<a name="module_TiJsonDB--table+limit"></a>

#### table.limit(limit, offset) ⇒
Limits the result

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: Array || Error  

| Param | Type | Default |
| --- | --- | --- |
| limit | <code>number</code> | <code></code> | 
| offset | <code>number</code> | <code>0</code> | 

<a name="module_TiJsonDB--table+delete"></a>

#### table.delete(String, onSuccess, onError) ⇒ <code>boolean</code>
Delete item by id

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: <code>boolean</code> - || function  

| Param | Type | Description |
| --- | --- | --- |
| String | <code>mixed</code> | || Array id |
| onSuccess | <code>\*</code> |  |
| onError | <code>\*</code> |  |

<a name="module_TiJsonDB--table+destroy"></a>

#### table.destroy(onSuccess, onError) ⇒ <code>boolean</code>
!! Warning !! 

This function REALLY deletes the whole table

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: <code>boolean</code> - || function  

| Param | Type | Default |
| --- | --- | --- |
| onSuccess | <code>\*</code> | <code></code> | 
| onError | <code>\*</code> | <code></code> | 

<a name="module_TiJsonDB--table+lastItem"></a>

#### table.lastItem(onSuccess, onError) ⇒ <code>object</code>
Return last item

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: <code>object</code> - || function  

| Param | Type | Default |
| --- | --- | --- |
| onSuccess | <code>\*</code> | <code></code> | 
| onError | <code>\*</code> | <code></code> | 


* * *

&copy; 2022 Sebastian Klaus