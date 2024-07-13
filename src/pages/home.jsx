import { useState, useEffect } from 'react';
import './home.css';
import api from '../libs/api';
import { Button, message, Form, Input, Switch } from 'antd';
function Home() {
  const [form] = Form.useForm();
  const [userId, setUserId] = useState('');
  const [checked, setChecked] = useState(false);
  const [checkDisabled, setCheckDisabled] = useState(false);
  useEffect(() => {
    api.get('/api/user').then(res => {
      const { result } = res.data;
      if (result) {
        const { name, email, phone, id } = result;
        setUserId(id)
        form.setFieldsValue({
          name,
          email,
          phone
        });
      } else {
        setChecked(true)
        setCheckDisabled(true)
      }
    })
  }, [])


  const onSubmit = async (values) => {
    let info
    if (userId) {
      info = await api.put('/api/user', {...values, id: userId})
    } else {
      info = await api.post('/api/user', values)
    }
    const { code, prompt } = info.data;
    if (code === '0000') {
      message.success('This is a success message');
      setChecked(false)
    } else {
      message.error(prompt);
    }
  }
  const onClick = () => {
    setChecked(!checked);
  }
  return (
    <div className="user">
      <div className="user-title">
        User Profile
        {
          checked && (
            <div className="user-title_tip">
              Update your information.
            </div>
          )
        }
        <Switch
          className='user-title-switch'
          checkedChildren="Edit"
          unCheckedChildren="Preview"
          checked={checked}
          onClick={onClick}
          disabled={checkDisabled}
        />
      </div>
      <div className="user-form">
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onSubmit={onSubmit}
          form={form}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please input your Name!' }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Please enter a valid email address!',
              }]}
          >
            <Input
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="phone"
            rules={[{ required: true, message: 'Please enter the correct phone number',pattern:new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g")}]}>
            <Input
              placeholder="Phone"
            />
          </Form.Item>
          {
            checked  && (
              <Form.Item>
                <Button type="primary" htmlType="submit" className="user-form-button">
                  Submit
                </Button>
              </Form.Item>
            )
          }
        </Form>
      </div>
    </div>

  );
}

export default Home;
