<a name="module_TiJsonDB"></a>

## TiJsonDB
JSON Database functions overview


* [TiJsonDB](#module_TiJsonDB)
    * [table(name)](#exp_module_TiJsonDB--table) ⇒ <code>TiJsonDB</code> ⏏
        * [.last_insert_id](#module_TiJsonDB--table+last_insert_id) ⇒ <code>string</code>
        * [.where(field, operator, value)](#module_TiJsonDB--table+where) ⇒ <code>TiJsonDb</code>
        * [.orWhere(field, operator, value)](#module_TiJsonDB--table+orWhere) ⇒ <code>TiJsonDb</code>
        * [.orderBy(key, order)](#module_TiJsonDB--table+orderBy) ⇒ <code>TiJsonDb</code>
        * [.limit(limit, offset)](#module_TiJsonDB--table+limit) ⇒ <code>TiJsonDb</code>
        * [.destroy(onSuccess, onError)](#module_TiJsonDB--table+destroy) ⇒ <code>boolean</code>
        * [.truncate(onSuccess, onError)](#module_TiJsonDB--table+truncate) ⇒ <code>boolean</code>
        * [.lastItem(onSuccess, onError)](#module_TiJsonDB--table+lastItem) ⇒ <code>object</code>
        * [.delete(onSuccess, onError)](#module_TiJsonDB--table+delete) ⇒ <code>number</code>
        * [.update(tableData, onSuccess, onError)](#module_TiJsonDB--table+update) ⇒ <code>array</code>
        * [.populate(tableData, onSuccess, onError)](#module_TiJsonDB--table+populate) ⇒ <code>number</code>
        * [.insert(tableData, onSuccess, onError)](#module_TiJsonDB--table+insert) ⇒ <code>number</code>
        * [.get(onSuccess, onError)](#module_TiJsonDB--table+get) ⇒ <code>array</code>
        * [.getById(id)](#module_TiJsonDB--table+getById) ⇒ <code>object</code>
        * [.find(id)](#module_TiJsonDB--table+find) ⇒ <code>object</code>
        * [.getSingle(field, value)](#module_TiJsonDB--table+getSingle) ⇒ <code>object</code>

<a name="exp_module_TiJsonDB--table"></a>

### table(name) ⇒ <code>TiJsonDB</code> ⏏
Set actual table to fetch from

**Kind**: Exported function  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="module_TiJsonDB--table+last_insert_id"></a>

#### table.last\_insert\_id ⇒ <code>string</code>
Return last item id

**Kind**: instance property of [<code>table</code>](#exp_module_TiJsonDB--table)  
<a name="module_TiJsonDB--table+where"></a>

#### table.where(field, operator, value) ⇒ <code>TiJsonDb</code>
Simple where clause chained with AND

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| field | <code>string</code> |  |  |
| operator | <code>string</code> | <code>&quot;&#x3D;&quot;</code> | '=', '!=', '>', '<', '>=', '<=', '<>', 'like', 'not like', 'in', 'not in', 'between' |
| value | <code>mixed</code> |  |  |

<a name="module_TiJsonDB--table+orWhere"></a>

#### table.orWhere(field, operator, value) ⇒ <code>TiJsonDb</code>
Or where clause
Functionality is the same as where and can only be chained after where

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| field | <code>string</code> |  |  |
| operator | <code>string</code> | <code>&quot;&#x3D;&quot;</code> | '=', '!=', '>', '<', '>=', '<=', '<>', 'like', 'not like', 'in', 'not in', 'between' |
| value | <code>mixed</code> |  |  |

<a name="module_TiJsonDB--table+orderBy"></a>

#### table.orderBy(key, order) ⇒ <code>TiJsonDb</code>
Order by field

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| key | <code>string</code> |  |  |
| order | <code>string</code> | <code>&quot;asc&quot;</code> | 'asc' || 'desc' || 'rand' |

<a name="module_TiJsonDB--table+limit"></a>

#### table.limit(limit, offset) ⇒ <code>TiJsonDb</code>
Limits the result

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default |
| --- | --- | --- |
| limit | <code>number</code> | <code></code> | 
| offset | <code>number</code> | <code>0</code> | 

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

#### table.lastItem(onSuccess, onError) ⇒ <code>object</code>
Return last item

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: <code>object</code> - || function  

| Param | Type | Default |
| --- | --- | --- |
| onSuccess | <code>function</code> | <code></code> | 
| onError | <code>function</code> | <code></code> | 

<a name="module_TiJsonDB--table+delete"></a>

#### table.delete(onSuccess, onError) ⇒ <code>number</code>
Delete entries
Returns the number of deleted entries

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default |
| --- | --- | --- |
| onSuccess | <code>function</code> | <code></code> | 
| onError | <code>function</code> | <code></code> | 

<a name="module_TiJsonDB--table+update"></a>

#### table.update(tableData, onSuccess, onError) ⇒ <code>array</code>
Update entries
Returns the number of updated entries

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default |
| --- | --- | --- |
| tableData | <code>object</code> |  | 
| onSuccess | <code>function</code> | <code></code> | 
| onError | <code>function</code> | <code></code> | 

<a name="module_TiJsonDB--table+populate"></a>

#### table.populate(tableData, onSuccess, onError) ⇒ <code>number</code>
Replace all data in table

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default |
| --- | --- | --- |
| tableData | <code>array</code> |  | 
| onSuccess | <code>function</code> | <code></code> | 
| onError | <code>function</code> | <code></code> | 

<a name="module_TiJsonDB--table+insert"></a>

#### table.insert(tableData, onSuccess, onError) ⇒ <code>number</code>
Insert data into table
Returns number of inserted entries

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| tableData | <code>mixed</code> |  | Array or Object |
| onSuccess | <code>function</code> | <code></code> |  |
| onError | <code>function</code> | <code></code> |  |

<a name="module_TiJsonDB--table+get"></a>

#### table.get(onSuccess, onError) ⇒ <code>array</code>
Fetch data from table

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default |
| --- | --- | --- |
| onSuccess | <code>function</code> | <code></code> | 
| onError | <code>function</code> | <code></code> | 

<a name="module_TiJsonDB--table+getById"></a>

#### table.getById(id) ⇒ <code>object</code>
Fetch single entry by id

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="module_TiJsonDB--table+find"></a>

#### table.find(id) ⇒ <code>object</code>
Find entry by id

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="module_TiJsonDB--table+getSingle"></a>

#### table.getSingle(field, value) ⇒ <code>object</code>
Returns the first found element

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type |
| --- | --- |
| field | <code>string</code> | 
| value | <code>mixed</code> | 


* * *

&copy; 2022 Sebastian Klaus