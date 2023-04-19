
import React, { Component } from 'react';
import axios from "axios";

import { Table, Input, Button, Icon, Typography,Popconfirm,Divider, Modal, Select, Row, Col  } from 'antd';

import { SecurePostWithFile } from '../../../services/axiosCall';

import apis from '../../../services/Apis';

import auth from '../../../services/AuthServices';

import Alert from '../../../components/common/alert';

class ImportQuestion extends Component {
  state = {
    file: '',
  }

 handleSubmit = async (event) => {

    event.preventDefault();
    const formData = new FormData();
    formData.append("file", this.state.file);

    const resp = await axios.post("http://localhost:5000/api/v1/questions/import_questions", formData, {
      headers: {
        "content-type": "multipart/form-data",
        // Authorization: `Bearer ${userInfo.token}`,
      },
      params: {
        Token : auth.retriveToken()
      }
    }).then((response) => {
      Alert('success','Success',"Question Imported Successfully");
    });
  };

//   SecurePostWithFile({
//     url:apis.IMPORT_QUESTION, formData
// }).then((response)=>{
//     console.log(response);
// }).catch((error)=>{
//     console.log(error);
// })
//  }




  handleFileInput = e => {
    this.setState({ file: e.target.files[0] });
  };

  render() {
    return (
        <form onSubmit={this.handleSubmit} >
        <h2>Upload Excel/CSV to Import</h2>
        <input type="file" onChange={this.handleFileInput} />
        <button  type="submit"  disabled={!this.state.file} >
          Import
        </button>
      </form>
    );
  }
}

export default ImportQuestion;


