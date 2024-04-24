import React from "react";
import { Form, FormGroup,Button } from "react-bootstrap";
import Router from "next/router";
import Image from "next/image";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { users:null, waiters:[],passcode:'', fulfillment:[] };
  }

  componentDidMount(){
    this.get_dashboard_detail();
  }

  async get_dashboard_detail(){
    var res = await app.get('/dashboard/passcode-with-panel');
        if(res.status){
            this.setState({users:res.data.user_data})
            this.setState({waiters:res.data.waiter_data})
        }
        else{
          app.toast(res.message, 'warning');
        }
  }

  

  setPassCodeValue = async (e) => {
    if (this.state.passcode.length <= 4) {
      // Use the callback function of setState to ensure you access the updated state
      this.setState((prevState) => ({ passcode: prevState.passcode + e.target.value }), () => {
        // This callback function will be called after the state has been updated
        if (this.state.passcode && this.state.passcode.length == 4) {
          this.handlesubmit();
        }
      });
    }
  }
  async handlesubmit(){
    var res = await app.post('/dashboard/passcode',{passcode:this.state.passcode});
        if(!res.status)
        {
            app.toast(res.message, 'warning');
            this.setState({passcode:''})
            return false;			
        }
        if(res.status)
        {
            sessionStorage.setItem("rms_dashboard_token", res.data.token);
            if(res.data.all_fulfillment.length>0)
            {
              sessionStorage.setItem("fulfillment", JSON.stringify(res.data.all_fulfillment));
            }

            const selected = res.data.all_dashboards.filter(user => user.main==1)[0];
            sessionStorage.setItem("select_current_user", JSON.stringify({id:selected.id, name:selected.name}));

            var redirection_to_page = {
              1:{url:'/assembly/orderassembly'},
              2:{url:'/orders/order'},
              3:{url:'/waiters/waiter'},
              4:{url:'/'},
              5:{url:'/tables/table_management'},
              6:{url:'/overview/table_management'},
              7:{url:'/waiter_manager/assign_tables'}
            }
            Router.push(redirection_to_page[Number(selected.id)].url)
                  
            app.toast(res.message, 'success'); 
                      
        }    
  }

  resetpasscode=(e)=>{
    this.setState({passcode:''})
  }

  backspace=(e)=>{
    var setval=this.state.passcode
    var val=''
    for(var i=0; i<setval.length-1;i++){
      val +=setval[i]
    }
    this.setState({passcode:val})

  }

  setInputs(data){
    return data.map((d)=>{
    return (<Button key={d} type="button" value={d} className="btn-passcode border border-0" onClick={this.setPassCodeValue}>{d}</Button>)})
}

  render() {
    const {users,waiters,passcode} = this.state
    return (
      <>
        <div className="container-fuild">
          <div className="waiters-navdash">
            <div className="row">
              <div className="d-flex justify-content-between">
                <div className="waiter">
                  <h5 className="menu-item fw-bold text-secondary  mt-4">
                    Dashboards
                  </h5>
                </div>
                {/* <div className="waiter">
                  <select className="form-select waiter-select  mt-4 pt-1">
                    <option>Restaurant Name</option>
                                      </select>
                </div> */}
              </div>
            </div>
            <hr></hr>
            <div className="row">
              <div className="col-md-4">
                <h6 className="waiter-heading text-secondary">Users</h6>
                <div className="user-waiter-details">
                    {users && users.map((user,index)=>
                    <div key={index} className="card-body dashboard-card box-shadow d-flex border-0 mb-2 p-1">
                        {/* <div className="rounded-cricle mb-2" style={{backgroungcolor: users.name_bg_color}}> */}
                        <div className="rounded-cricle mb-2"  >
                        <div className={`rounded-circle dashboard-cricle-big rounded-pill-user text-white  ${user.name_bg_color}`}>
                          <span className="customer-name-waiter">{user.short_name}</span>
                        </div>
                        </div>
                        <div className="waiter-heading">
                        <h2 className="heading  main-dashboard-heading mt-3">
                            <a href="Dashboardwaiters" className="text-color">{user.name}</a>
                        </h2>
                        </div>
                    </div>
                    )}
                  
                </div>
              </div>
              <div className="col-md-4">
                <div className="row mt-3">
                  <div className="trikolore">
                    {waiters && waiters.map((waiter,index)=>
                    <div key={index} className="card-body schwarz-box dashboard-card box-shadow d-flex p-1 mt-2">
                      <div className="rounded-cricle mt-1">
                        <div className={`rounded-circle dashboard-cricle-big rounded-pill text-white ${waiter.name_bg_color}`} >
                          <span className="customer-name-waiter">{waiter.short_name}</span>
                        </div>
                        <h6 className="cricle-heading-waiter text-secondary mt-2">{waiter.name}
                        </h6>
                      </div>
{waiter.occupied_cnt!=0?(
                      <div className="waiter-heading">
                        <span className="badge waiter-badge vived-red">{waiter.occupied_cnt}</span>
                      </div>
):""}
                    </div>
                    )}                    
                    
                    
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="users-pin">
                    <h6 className="waiter-heading text-secondary">User’s Pin</h6>
                    <div className="card-body dashboard-card box-shadow p-1 mt-2 right-side-login">
                    <Form onSubmit={this.handleSubmit}>
					    <FormGroup>
                <div className="cricle-dot mx-auto mt-4">
                      <ul className="cricle-dot-ul">
                        <li className="cricle-dot-li">
                          <span className={`dot ${passcode.length>=1?"fill-dot":""}`} ></span>
                        </li>
                        <li className="cricle-dot-li">
                          <span className={`dot ${passcode.length>=2?"fill-dot":""}`}></span>
                        </li>
                        <li className="cricle-dot-li">
                          <span className={`dot ${passcode.length>=3?"fill-dot":""}`}></span>
                        </li>
                        <li className="cricle-dot-li">
                          <span className={`dot ${passcode.length>=4?"fill-dot":""}`}></span>
                        </li>
                      </ul>
                    </div>
							  <center>
							  {
								  this.setInputs([1,2,3,4,5,6,7,8,9])
							  }
								<Button type="button" className="btn-passcode btn-back vived-red border-0" onClick={this.resetpasscode} ><Image src="/assets/images/Closed.png" width={35} height={35} alt="reset" className="mobile-screenimg"/></Button>
								<Button  type="button" value={0} className="btn-passcode border-0" onClick={this.setPassCodeValue}>{0}</Button>
								<Button  type="button" className="btn-passcode btn-login yellow-btn border-0" onClick={this.backspace} ><Image src="/assets/images/Login.png" width={35} height={35} alt="backspace" className="mobile-screenimg" /></Button>
							  </center>
							  </FormGroup>
							 
						</Form>
                    
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
