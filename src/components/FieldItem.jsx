import { useState } from 'react';
import { Button, Card, Input, Select, Space, Switch } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

function FieldItem({ field, onUpdate, onRemove }) {
  
  const [showChildren, setShowChildren] = useState(field.type === 'Nested' || field.type === 'Array of Objects');

  
  const handleChange = (key, value) => {
    if (key === 'type') {
      
      if (value === 'Nested' || value === 'Array of Objects') {
        setShowChildren(true);
      } else {
        
        setShowChildren(false);
        onUpdate(field.id, 'children', []); 
      }
    }
    
    onUpdate(field.id, key, value);
  };

  
  const addChild = () => {
    const newChild = {
      id: Date.now() + Math.random(), 
      name: '', 
      type: 'String', 
      children: [], 
    };
    
    handleChange('children', [...field.children, newChild]);
  };

  
  const updateChild = (childId, key, value) => {
    
    const updatedChildren = field.children.map(child =>
      child.id === childId ? { ...child, [key]: value } : child
    );
    
    handleChange('children', updatedChildren);
  };

  
  const removeChild = (childId) => {
    
    const updatedChildren = field.children.filter(child => child.id !== childId);
    
    handleChange('children', updatedChildren);
  };

  
  const isNestedType = field.type === 'Nested' || field.type === 'Array of Objects';

  return (
    <Card
      size="small"
      style={{
        marginBottom: '10px',
        
        borderLeft: isNestedType ? '3px solid #1890ff' : 'none', 
        paddingLeft: isNestedType ? '10px' : '0', 
        marginLeft: isNestedType ? '10px' : '0', 
      }}
    >
      <Space wrap>
        {/* Input for Field Name */}
        <Input
          placeholder="Field Name"
          value={field.name}
          onChange={(e) => handleChange('name', e.target.value)}
          status={!field.name ? 'error' : ''} 
          style={{ width: '150px' }}
        />
        {/* Select for Field Type */}
        <Select
          value={field.type}
          onChange={(value) => handleChange('type', value)}
          options={[
            { label: 'String', value: 'String' },
            { label: 'Number', value: 'Number' },
            { label: 'Boolean', value: 'Boolean' },
            { label: 'ObjectId', value: 'ObjectId' },
            { label: 'Array', value: 'Array' },
            { label: 'Nested', value: 'Nested' },
            { label: 'Array of Objects', value: 'Array of Objects' }, 
          ]}
          style={{ width: '150px' }}
        />
        {/* Switch to toggle children visibility for 'Nested' or 'Array of Objects' types */}
        <Switch
          checked={showChildren}
          onChange={(checked) => setShowChildren(checked)}
          
          disabled={!isNestedType}
        />
        {/* Button to remove the current field */}
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemove(field.id)}
        />
      </Space>

      {/* Render children if showChildren is true and type is 'Nested' or 'Array of Objects' */}
      {showChildren && isNestedType && (
        <div style={{ marginTop: '10px' }}>
          {field.children.map(child => (
            <FieldItem
              key={child.id}
              field={child}
              onUpdate={updateChild}
              onRemove={removeChild}
            />
          ))}
          {/* Button to add a new child */}
          <Button type="primary" onClick={addChild} style={{ marginTop: '10px' }}>
            + Add Item
          </Button>
        </div>
      )}
    </Card>
  );
}

export default FieldItem;
