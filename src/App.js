import "./App.css";
import axios from "axios";
import React, { Component } from "react";
import { Table, Space, Divider, Modal, Form, Input, Button } from "antd";
import "antd/dist/antd.css";
import { filter } from "lodash";

const { Column } = Table;
const _ = require("lodash");

class App extends Component {
  constructor(props) {
    // console.log(props);
    super(props);
    this.state = {
      dataFetched: {},
      selectedData: {},
      visible: false,
      imgSrc: "",
      imgURLState: "",
      isEdited: false,
    };
  }

  componentDidMount() {
    this.getData();
  }
  // componentDidUpdate() {
  //   if(this.state.isEdited){

  //   }
  // }

  getData = () => {
    axios
      .get("https://reqres.in/api/users?page=1")
      .then((res) => this.setState({ dataFetched: res.data }));
  };

  editData = (record) => {
    console.log(record);
    this.setState({
      visible: true,
      selectedData: record,
      imgURLState: record.avatar,
    });
  };

  deleteData = (record) => {
    console.log(record)
    let filteredData = this.state.dataFetched.data?.filter((item) => item.id !== record.id);
    console.log(filteredData);
    this.setState((prevState) => ({
      dataFetched: {
        ...prevState.dataFetched,
        data: filteredData,
      },
    }));
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  onFinish = (values) => {
    console.log("values", values);
    let editedData = _.unionBy([values], this.state.dataFetched.data, "id");
    console.log(editedData);
    this.setState((prevState) => ({
      dataFetched: {
        ...prevState.dataFetched,
        data: editedData,
      },
    }));
    this.setState({
      visible: false,
      isEdited: true,
    });
  };

  onImageChange = (e) => {
    var file = e.target.files[0];
    let imgUrl = URL.createObjectURL(e.target.files[0]);
    console.log(file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.setState({
        imgSrc: reader.result,
        imgURLState: imgUrl,
      });
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };
  render() {
    console.log(this.state.dataFetched);
    return (
      <div className="App">
        <Table
          dataSource={this.state.dataFetched.data}
          rowKey={(record) => record.id}
        >
          <Column title="First Name" dataIndex="first_name" key="first_name" />
          <Column title="Last Name" dataIndex="last_name" key="last_name" />
          <Column title="Email" dataIndex="email" key="email" />
          <Column
            title="Avatar"
            dataIndex="avatar"
            key="avatar"
            render={(avatar) => <img src={avatar} alt="image" height="50" />}
          />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <Space size="middle">
                <a
                  onClick={() => {
                    this.editData(record);
                  }}
                >
                  Edit
                </a>
                <center>
                  <Divider type="vertical" style={{ minHeight: "15px" }} />
                </center>
                <a onClick={() => {
                    this.deleteData(record);
                  }}>Delete</a>
              </Space>
            )}
          />
        </Table>
        <Modal
          title="Edit Data"
          visible={this.state.visible}
          footer={null}
          centered
          width="80%"
          destroyOnClose={true}
          onCancel={() => this.handleCancel()}
          width="700px"
        >
          <Form
            name="editDetails"
            onFinish={this.onFinish}
            labelCol={{ span: 8 }}
            initialValues={{
              id: this.state.selectedData.id,
              first_name: this.state.selectedData.first_name,
              last_name: this.state.selectedData.last_name,
              email: this.state.selectedData.email,
              // avatar: this.state.selectedData.avatar
            }}
          >
            <Form.Item name="id" label="id" hidden>
              <Input type="string"></Input>
            </Form.Item>
            <Form.Item name="first_name" label="First Name">
              <Input type="string"></Input>
            </Form.Item>
            <Form.Item name="last_name" label="Last Name">
              <Input type="string"></Input>
            </Form.Item>
            <Form.Item name="email" label="E-Mail">
              <Input type="string"></Input>
            </Form.Item>
            <Form.Item name="avatar" label="Avatar">
              <Input
                accept="image/*"
                type="file"
                onChange={this.onImageChange}
              />
            </Form.Item>
            <Form.Item label="Preview">
              <img src={this.state.imgSrc} alt="img" height="70" />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 10,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default App;
