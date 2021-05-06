import React, { Component } from 'react';
import './App.css';

class App extends Component{
  constructor() {
    super();
    this.state = {
      items: [],
      isEditing: false,
      input: '',
      progress:0
    }
  }
  componentDidMount() {
    if (localStorage.getItem !== null) {
    let all=JSON.parse(localStorage.getItem("items"));
    let progress = JSON.parse(localStorage.getItem("progress"));
    this.setState({items: all});
    this.setState({progress: progress});
  }
  componentDidUpdate() {
    localStorage.setItem("items", JSON.stringify(this.state.items));
    localStorage.setItem("progress", JSON.stringify(this.state.progress));
  }
  onEditing=()=> {
    this.setState({ isEditing: true });
  }
  onChange = (e) => {

    this.setState({ input: e.target.value },()=>this.setProgress(this.state.items));
  }
  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.input.length === 0) { return;}
    const items = {
      id: new Date().getTime(),
      text: this.state.input,
      isCompleted:false
    }
    let str = items.text.replace(/^\s+/g, "");
    if (str.length !== 0) {
      this.setState({ items: this.state.items.concat(items), input: '' }, () => this.setProgress(this.state.items))
    } else {
      alert("Enter valid items");
    }
  }
  onDelete = (id) => {
    let filtered=this.state.items.filter(item => {
      return item.id !== id;
    })
    this.setState({ items: filtered },()=>this.setProgress(this.state.items));
  }
  setProgress = (items) => {
    let checked = items.filter(item => { return item.isCompleted })
    let progress = checked.length / items.length;
    if (!progress) { return this.setState({ progress: 0 }); }
    this.setState({ progress: Math.floor(progress*100) });
  }
  onClick = (id) => {
    let updated = this.state.items.map(item => {
      if (item.id === id) {
        item.isCompleted = !item.isCompleted
      }
      return item;
    })
    this.setState({ items: updated },()=>this.setProgress(this.state.items));
  }

  render() {
    return (
      <form id="todo-list" onSubmit={this.onSubmit}>
        <div className="progress">
          <div className="progress-bar" role="progressbar" style={{width:this.state.progress+"%"}} >{this.state.progress+"%"}</div>
        </div>
        { this.state.isEditing ?
          <span className="todo-wrap"><br/><br/>
            <input onChange={this.onChange} value={this.state.input} />
          </span> : ""}
        <div onClick={()=>this.onEditing()} id="add-todo"><i className="fa fa-plus"></i>
        &nbsp; Add an item</div>
        { this.state.items.length > 0 ?
          this.state.items.map((item,i) => {
            return (
              <span className="todo-wrap" key={i}>
                <span onClick={()=>this.onClick(item.id)}>
                  <input type="checkbox" checked={item.isCompleted}/>
                  <label className="todo"><i class="fa fa-check"></i>{item.text}</label>
                </span>
                <span className="delete-item" onClick={()=>this.onDelete(item.id)} title="remove">
                <i className="fa fa-times-circle"></i>
              </span>
            </span>
            )
           }): <p></p>
        }
     </form>
    )
  }
}
export default App;
