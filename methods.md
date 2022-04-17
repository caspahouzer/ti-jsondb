<a name="module_TiJsonDB"></a>

## TiJsonDB
JSON Database functions overview


* [TiJsonDB](#module_TiJsonDB)
    * [table(name)](#exp_module_TiJsonDB--table) ⇒ <code>TiJsonDB</code> ⏏
        * [.last_insert_id](#module_TiJsonDB--table+last_insert_id) ⇒ <code>String</code>
        * [.select(fields)](#module_TiJsonDB--table+select) ⇒ <code>TiJsonDb</code>
        * [.where(field, operator, value)](#module_TiJsonDB--table+where) ⇒ <code>TiJsonDb</code>
        * [.orWhere(field, operator, value)](#module_TiJsonDB--table+orWhere) ⇒ <code>TiJsonDb</code>
        * [.orderBy(key, order)](#module_TiJsonDB--table+orderBy) ⇒ <code>TiJsonDb</code>
        * [.limit(limit, offset)](#module_TiJsonDB--table+limit) ⇒ <code>TiJsonDb</code>
        * [.destroy(onSuccess, onError)](#module_TiJsonDB--table+destroy) ⇒ <code>boolean</code>
        * [.truncate(onSuccess, onError)](#module_TiJsonDB--table+truncate) ⇒ <code>boolean</code>
        * [.lastItem(onSuccess, onError)](#module_TiJsonDB--table+lastItem) ⇒ <code>Object</code>
        * [.delete(onSuccess, onError)](#module_TiJsonDB--table+delete) ⇒ <code>Number</code>
        * [.update(tableData, onSuccess, onError)](#module_TiJsonDB--table+update) ⇒ <code>Array</code>
        * [.populate(tableData, onSuccess, onError)](#module_TiJsonDB--table+populate) ⇒ <code>Number</code>
        * [.insert(tableData, onSuccess, onError)](#module_TiJsonDB--table+insert) ⇒ <code>Number</code>
        * [.get(onSuccess, onError)](#module_TiJsonDB--table+get) ⇒ <code>Array</code>
        * [.getById(id)](#module_TiJsonDB--table+getById) ⇒ <code>Object</code>
        * [.find(id)](#module_TiJsonDB--table+find) ⇒ <code>Object</code>
        * [.last(onSuccess, onError)](#module_TiJsonDB--table+last) ⇒ <code>Object</code>
        * [.getSingle(field, value)](#module_TiJsonDB--table+getSingle) ⇒ <code>Object</code>

<a name="exp_module_TiJsonDB--table"></a>

### table(name) ⇒ <code>TiJsonDB</code> ⏏
Set actual table to fetch from

**Kind**: Exported function  

| Param | Type |
| --- | --- |
| name | <code>String</code> | 

<a name="module_TiJsonDB--table+last_insert_id"></a>

#### table.last\_insert\_id ⇒ <code>String</code>
Return last item id

**Kind**: instance property of [<code>table</code>](#exp_module_TiJsonDB--table)  
<a name="module_TiJsonDB--table+select"></a>

#### table.select(fields) ⇒ <code>TiJsonDb</code>
Select fields to fetch from objects
Use * to select all fields

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fields | <code>String</code> | <code>*</code> | Comma separated list of fields to select |

<a name="module_TiJsonDB--table+where"></a>

#### table.where(field, operator, value) ⇒ <code>TiJsonDb</code>
Simple where clause chained with AND

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| field | <code>String</code> |  |  |
| operator | <code>String</code> | <code>&#x3D;</code> | '=', '!=', '>', '<', '>=', '<=', '<>', 'like', 'not like', 'in', 'not in', 'between' |
| value | <code>Mixed</code> |  |  |

<a name="module_TiJsonDB--table+orWhere"></a>

#### table.orWhere(field, operator, value) ⇒ <code>TiJsonDb</code>
Or where clause
Functionality is the same as where and can only be chained after where

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| field | <code>String</code> |  |  |
| operator | <code>String</code> | <code>&#x3D;</code> | '=', '!=', '>', '<', '>=', '<=', '<>', 'like', 'not like', 'in', 'not in', 'between' |
| value | <code>Mixed</code> |  |  |

<a name="module_TiJsonDB--table+orderBy"></a>

#### table.orderBy(key, order) ⇒ <code>TiJsonDb</code>
Order by field

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>String</code> |  |  |
| order | <code>String</code> | <code>asc</code> | 'asc' || 'desc' || 'rand' |

<a name="module_TiJsonDB--table+limit"></a>

#### table.limit(limit, offset) ⇒ <code>TiJsonDb</code>
Limits the result

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default |
| --- | --- | --- |
| limit | <code>Number</code> | <code></code> | 
| offset | <code>Number</code> | <code>0</code> | 

<a name="module_TiJsonDB--table+destroy"></a>

#### table.destroy(onSuccess, onError) ⇒ <code>boolean</code>
!! Warning !! 

This function REALLY deletes the whole table

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default |
| --- | --- | --- |
| onSuccess | <code>function</code> | <code></code> | 
| onError | <code>function</code> | <code></code> | 

<a name="module_TiJsonDB--table+truncate"></a>

#### table.truncate(onSuccess, onError) ⇒ <code>boolean</code>
Truncate table

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default |
| --- | --- | --- |
| onSuccess | <code>function</code> | <code></code> | 
| onError | <code>function</code> | <code></code> | 

<a name="module_TiJsonDB--table+lastItem"></a>

#### table.lastItem(onSuccess, onError) ⇒ <code>Object</code>
Return last item

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: <code>Object</code> - || function  

| Param | Type | Default |
| --- | --- | --- |
| onSuccess | <code>function</code> | <code></code> | 
| onError | <code>function</code> | <code></code> | 

<a name="module_TiJsonDB--table+delete"></a>

#### table.delete(onSuccess, onError) ⇒ <code>Number</code>
Delete entries
Returns the number of deleted entries

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default |
| --- | --- | --- |
| onSuccess | <code>function</code> | <code></code> | 
| onError | <code>function</code> | <code></code> | 

<a name="module_TiJsonDB--table+update"></a>

#### table.update(tableData, onSuccess, onError) ⇒ <code>Array</code>
Update entries
Returns the number of updated entries

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default |
| --- | --- | --- |
| tableData | <code>Object</code> |  | 
| onSuccess | <code>function</code> | <code></code> | 
| onError | <code>function</code> | <code></code> | 

<a name="module_TiJsonDB--table+populate"></a>

#### table.populate(tableData, onSuccess, onError) ⇒ <code>Number</code>
Replace all data in table

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default |
| --- | --- | --- |
| tableData | <code>Array</code> |  | 
| onSuccess | <code>function</code> | <code></code> | 
| onError | <code>function</code> | <code></code> | 

<a name="module_TiJsonDB--table+insert"></a>

#### table.insert(tableData, onSuccess, onError) ⇒ <code>Number</code>
Insert data into table
Returns number of inserted entries

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tableData | <code>Mixed</code> |  | Array or Object |
| onSuccess | <code>function</code> | <code></code> |  |
| onError | <code>function</code> | <code></code> |  |

<a name="module_TiJsonDB--table+get"></a>

#### table.get(onSuccess, onError) ⇒ <code>Array</code>
Fetch data from table

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default |
| --- | --- | --- |
| onSuccess | <code>function</code> | <code></code> | 
| onError | <code>function</code> | <code></code> | 

<a name="module_TiJsonDB--table+getById"></a>

#### table.getById(id) ⇒ <code>Object</code>
Fetch single entry by id

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

<a name="module_TiJsonDB--table+find"></a>

#### table.find(id) ⇒ <code>Object</code>
Find entry by id

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type |
| --- | --- |
| id | <code>String</code> | 

<a name="module_TiJsonDB--table+last"></a>

#### table.last(onSuccess, onError) ⇒ <code>Object</code>
Get last entry

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default |
| --- | --- | --- |
| onSuccess | <code>function</code> | <code></code> | 
| onError | <code>function</code> | <code></code> | 

<a name="module_TiJsonDB--table+getSingle"></a>

#### table.getSingle(field, value) ⇒ <code>Object</code>
Returns the first found element

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type |
| --- | --- |
| field | <code>String</code> | 
| value | <code>Mixed</code> | 


* * *

&copy; 2022 Sebastian Klaus