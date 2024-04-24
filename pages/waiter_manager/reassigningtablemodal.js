import React, { Component } from "react";

export default class ReassigningTableModal extends Component {
  constructor(props) {
    super(props);
    this.state = { sessionselected: false };
  }

  getcomment = (e) => {
    console.log("text: ", e.target.value);
    this.setState({ comment: e.target.value });
  };

  getsession = (event) => {
    const{checked} = event.target
    console.log("Checked: ", checked)
    if(checked)
        {          
          this.setState({sessionselected:true})
        }
  }; 

  onSubmit=()=>{
    console.log("sessionselected: ", this.state.sessionselected)
    this.props.onSubmitreassign("ChangeWaiter",this.state.sessionselected)
  }

  render() {
    const { isOpen, onClose } = this.props;
    if (!isOpen) return null;
    console.log("Session Selected: ", this.state.sessionselected)

    return (
      <>
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-content mx-auto" id="pink-add-comment">
              <h6 className="menu-item text-color text-start fw-bold ">Reassigning Table</h6>
              <hr className='p-0 m-0'></hr>
              <h6 className="menu-item text-color text-start fw-bold pt-0 mt-3 mb-3">Table 17<br/>Deck 1</h6>
              <hr className='p-0 m-0'></hr>
              <h3 className='profile-location waiter-heading text-color mt-2'>Are you sure you want to reassign this table?</h3>
              <div className='d-flex justify-content-between mt-2'>
                <div className='builder'>
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input big_check" id="Out-of-stock" name="optradioRare" value="option1" onChange={this.getsession} />
                    <span className="peragraph profile-heading text-colorpt-1 ">Remember for this session</span>
                    <label className="form-check-label" htmlFor="Out-of-stock"></label>
                  </div>
                </div>                
              </div>
              <div className="d-flex justify-content-end mt-5">
                <div className="builder">
                  <button type="submit" className="menu-item right dashboard-green-btn delete-dashboard" onClick={this.onSubmit}>Yes</button>
                </div>
                <div className="builder">
                  <button type="button" className="menu-item right dashboard-pink-btn delete-dashboard" onClick={onClose}>No</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
