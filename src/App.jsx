import { useState } from 'react';
import { Button, Typography, Space } from 'antd';
import FieldItem from './components/FieldItem';

const { Title } = Typography;

function App() {
  const [fields, setFields] = useState([]);
  const [submittedJSON, setSubmittedJSON] = useState(null);

  const addField = () => {
    const newField = {
      id: Date.now() + Math.random(),
      name: '',
      type: 'String',
      children: [],
    };
    setFields([...fields, newField]);
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  const removeField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleSubmit = () => {
    const generateSchema = (fieldsArray) => {
      const schema = {};
      fieldsArray.forEach(field => {
        if (!field.name) return;
        if (field.type === 'Nested') {
          schema[field.name] = generateSchema(field.children);
        } else {
          schema[field.name] = field.type.toLowerCase();
        }
      });
      return schema;
    };
    setSubmittedJSON(generateSchema(fields));
  };

  const handleReset = () => {
    setFields([]);
    setSubmittedJSON(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title>JSON Schema Builder</Title>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '30px' }}>
        {/* Left Section */}
        <div style={{ flex: 1 }}>
          <Button type="primary" onClick={addField}>Add Field</Button>

          <Space direction="vertical" style={{ width: '100%', marginTop: '20px' }}>
            {fields.map(field => (
              <FieldItem
                key={field.id}
                field={field}
                onUpdate={updateField}
                onRemove={removeField}
              />
            ))}
          </Space>

          <div style={{ marginTop: '20px' }}>
            <Button type="primary" onClick={handleSubmit} style={{ marginRight: '10px' }}>
              Submit
            </Button>

            <Button danger onClick={() => {
              setFields([]);
              setSubmittedJSON(null);
            }}>
              Reset
            </Button>
          </div>

        </div>

        {/* Right Section */}
        <div style={{ flex: 1 }}>
          <Title level={4}>Live JSON Preview</Title>
          <pre>{JSON.stringify(fields, null, 2)}</pre>

          {submittedJSON && (
            <>
              <Title level={4}>Submitted JSON</Title>
              <pre style={{ backgroundColor: '#cceeff', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
              {JSON.stringify(submittedJSON, null, 2)}</pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
