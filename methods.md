<a name="module_TiJsonDB"></a>

## TiJsonDB
JSON Database functions overview


* [TiJsonDB](#module_TiJsonDB)
    * [table(name)](#exp_module_TiJsonDB--table) ⇒ ⏏
        * [.last_insert_id](#module_TiJsonDB--table+last_insert_id) ⇒ <code>string</code>
        * [.where(field, operator, value)](#module_TiJsonDB--table+where) ⇒
        * [.orderBy(key, order)](#module_TiJsonDB--table+orderBy) ⇒
        * [.limit(limit, offset)](#module_TiJsonDB--table+limit) ⇒
        * [.delete(String, onSuccess, onError)](#module_TiJsonDB--table+delete) ⇒ <code>boolean</code>
        * [.destroy(onSuccess, onError)](#module_TiJsonDB--table+destroy) ⇒ <code>boolean</code>
        * [.truncate(onSuccess, onError)](#module_TiJsonDB--table+truncate) ⇒ <code>boolean</code>
        * [.lastItem(onSuccess, onError)](#module_TiJsonDB--table+lastItem) ⇒ <code>object</code>
        * [.update(tableData, onSuccess, onError)](#module_TiJsonDB--table+update) ⇒
        * [.populate(tableData, onSuccess, onError)](#module_TiJsonDB--table+populate)
        * [.insert(tableData, onSuccess, onError)](#module_TiJsonDB--table+insert) ⇒
        * [.get(onSuccess, onError)](#module_TiJsonDB--table+get) ⇒
        * [.getById(id)](#module_TiJsonDB--table+getById) ⇒
        * [.getSingle(field, value)](#module_TiJsonDB--table+getSingle) ⇒

<a name="exp_module_TiJsonDB--table"></a>

### table(name) ⇒ ⏏
Set actual table to fetch from

**Kind**: Exported function  
**Returns**: TiJsonDB  

| Param | Type |
| --- | --- |
| name | <code>\*</code> | 

<a name="module_TiJsonDB--table+last_insert_id"></a>

#### table.last\_insert\_id ⇒ <code>string</code>
Return last item id

**Kind**: instance property of [<code>table</code>](#exp_module_TiJsonDB--table)  
<a name="module_TiJsonDB--table+where"></a>

#### table.where(field, operator, value) ⇒
Simple where clause chained with AND

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: Array || Error  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| field | <code>mixed</code> |  | String || Array |
| operator | <code>String</code> | <code>&#x3D;</code> | '=', '!=', '>', '<', '>=', '<=', 'like', 'not like', 'in', 'not in', 'between' |
| value | <code>mixed</code> |  |  |

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

<a name="module_TiJsonDB--table+truncate"></a>

#### table.truncate(onSuccess, onError) ⇒ <code>boolean</code>
Truncate table

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

<a name="module_TiJsonDB--table+update"></a>

#### table.update(tableData, onSuccess, onError) ⇒
Update table data

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: Array || Error  

| Param | Type | Default |
| --- | --- | --- |
| tableData | <code>\*</code> |  | 
| onSuccess | <code>\*</code> | <code></code> | 
| onError | <code>\*</code> | <code></code> | 

<a name="module_TiJsonDB--table+populate"></a>

#### table.populate(tableData, onSuccess, onError)
Replace all data in table

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  

| Param | Type | Default |
| --- | --- | --- |
| tableData | <code>\*</code> |  | 
| onSuccess | <code>\*</code> | <code></code> | 
| onError | <code>\*</code> | <code></code> | 

<a name="module_TiJsonDB--table+insert"></a>

#### table.insert(tableData, onSuccess, onError) ⇒
Insert data into table

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: Array || Error  

| Param | Type | Default |
| --- | --- | --- |
| tableData | <code>\*</code> |  | 
| onSuccess | <code>\*</code> | <code></code> | 
| onError | <code>\*</code> | <code></code> | 

<a name="module_TiJsonDB--table+get"></a>

#### table.get(onSuccess, onError) ⇒
Fetch data from table

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: Array || Error  

| Param | Type | Default |
| --- | --- | --- |
| onSuccess | <code>\*</code> | <code></code> | 
| onError | <code>\*</code> | <code></code> | 

<a name="module_TiJsonDB--table+getById"></a>

#### table.getById(id) ⇒
Fetch single entry by id

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: Object || Error  

| Param | Type |
| --- | --- |
| id | <code>string</code> | 

<a name="module_TiJsonDB--table+getSingle"></a>

#### table.getSingle(field, value) ⇒
Returns the first found element

**Kind**: instance method of [<code>table</code>](#exp_module_TiJsonDB--table)  
**Returns**: Object || Error  

| Param | Type |
| --- | --- |
| field | <code>string</code> | 
| value | <code>mixed</code> | 


* * *

&copy; 2022 Sebastian Klaus