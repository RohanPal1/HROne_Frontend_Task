import React, { useState } from "react";
import "./App.css";

const Input_types = ["string", "number", "boolean", "nested", "float"];

const FormField = ({ field, onChange, onDelete }) => {
  const handleChange = (key, value) => {
    onChange({ ...field, [key]: value });
  };

  const addNestedChild = () => {
    const children = field.children || [];
    handleChange("children", [
      ...children,
      { key: "", type: "string", value: "", children: [] },
    ]);
  };

  return (
    <div className="field-wrapper">
      <div className="field-row">
        <input
          placeholder="Key"
          value={field.key}
          onChange={(e) => handleChange("key", e.target.value)}
        />
        <select
          value={field.type}
          onChange={(e) => handleChange("type", e.target.value)}
        >
          {Input_types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {/* {field.type !== "nested" && (
          <input
            placeholder="Value"
            value={field.value}
            onChange={(e) => handleChange("value", e.target.value)}
          />
        )} */}
        <button className="delete-btn" onClick={onDelete}>
          ✖
        </button>
      </div>

      {/* Nested children rendering */}
      {field.type === "nested" && (
        <div className="nested section">
          {(field.children || []).map((child, index) => (
            <FormField
              key={index}
              field={child}
              onChange={(updatedChild) => {
                const newChildren = [...(field.children || [])];
                newChildren[index] = updatedChild;
                handleChange("children", newChildren);
              }}
              onDelete={() => {
                const newChildren = field.children.filter(
                  (_, i) => i !== index
                );
                handleChange("children", newChildren);
              }}
            />
          ))}

          <button className="add-btn" onClick={addNestedChild}>
            + Add Item
          </button>
        </div>
      )}
    </div>
  );
};

const JsonOutputBuilder = ({ data, updateFormData }) => {
  const handleFieldChange = (index, updatedField) => {
    const newData = [...data];
    newData[index] = updatedField;
    updateFormData(newData);
  };

  const handleDelete = (index) => {
    const newData = data.filter((_, i) => i !== index);
    updateFormData(newData);
  };

  const addField = () => {
    updateFormData([
      ...data,
      { key: "", type: "string", value: "", children: [] },
    ]);
  };

  return (
    <div className="builder">
      {data.map((field, index) => (
        <FormField
          key={index}
          field={field}
          onChange={(updated) => handleFieldChange(index, updated)}
          onDelete={() => handleDelete(index)}
        />
      ))}
      <button className="add-btn" onClick={addField}>
        + Add Item
      </button>
    </div>
  );
};

function App() {
  const [formData, setFormData] = useState([]);

  const generateJson = (fields) => {
    const obj = {};
    fields.forEach((field) => {
      if (!field.key) return;
      if (field.type === "nested") {
        obj[field.key] = generateJson(field.children || []);
      } else {
        // obj[field.key] =
        //   field.type === "number"
        //     ? Number(field.value)
        //     : field.type === "boolean"
        //     ? field.value === "true" || field.value === true
        //     : String(field.value);
        obj[field.key] = field.type;
      }
    });
    return obj;
  };

  return (
    <div className="app">
      <div className="left">
        <h2>Input</h2>
        <JsonOutputBuilder data={formData} updateFormData={setFormData} />
      </div>
      <div className="right">
        <h2>Output</h2>
        <div className="output">
          {JSON.stringify(generateJson(formData), null, 2)}
        </div>
      </div>
    </div>
  );
}

export default App;
