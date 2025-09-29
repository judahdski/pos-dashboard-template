import React, { useEffect, useState } from "react";

const TemplateForm = ({ children, OnSubmit, OnLoadData }) => {
  const [values, setValues] = useState({});

  const ChangeHandler = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }

  const onSubmit = (e) => {
    e.preventDefault();

    OnSubmit(values);
  }

  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.props.name) {

      return React.cloneElement(child, {
        onChange: (val) => ChangeHandler(child.props.name, val),
        value: values[child.props.name] || null
      });
    }
  });

  useEffect(() => {
    if (OnLoadData) {
      const fetchData = async () => {
        const data = await OnLoadData();

        setValues(prev => ({ ...prev, ...data })); // jangan merge, tapi cari dulu dan replace kalo ada data lama
      }
      fetchData();
    }
  }, [OnLoadData]);

  return <form onSubmit={onSubmit} method="POST">{enhancedChildren}</form>;
}

export default TemplateForm;