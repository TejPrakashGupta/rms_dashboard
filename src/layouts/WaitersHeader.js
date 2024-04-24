import React from 'react';
import Clock from './getdatetime';
import Router from "next/router";
import Image from 'next/image';


export default class WaitersHeader extends React.Component{

	constructor(props){
		super(props);
		this._token = '';
		this._user = 'Admin';
		if (typeof window !== 'undefined')
		{
			this._token =  sessionStorage.getItem('rms_dashboard_token')
			this._token ? '' : location.href='/';
		}
		this.state={selected:null, selected_user:null}
	}

	componentDidMount(){
		
		this.setState({ selected_user: sessionStorage.getItem('select_current_user') ? (sessionStorage.getItem('select_current_user')) : [], });
		  
	}

	  selectuser=(e)=>{
		const{name, value} = e.target
    	const value_parse = JSON.parse(value)
		var redirection_to_page = {
			1:{url:'/assembly/orderassembly'},
			2:{url:'/orders/order'},
			3:{url:'/waiters/waiter'},
			4:{url:'/reports_analysis/analytics'},
			5:{url:'/tables/table_management'},
			6:{url:'/overview/table_management'},
			7:{url:'/waiter_manager/assign_tables'}
		}
		Router.push(redirection_to_page[value_parse.id].url)
		this.setState({args:[{id:value_parse.id, name:value_parse.name}]})
		sessionStorage.setItem("select_current_user", JSON.stringify({id:value_parse.id, name:value_parse.name}));
		
	  }

	  
	  logout=()=>{
		sessionStorage.removeItem("rms_dashboard_token")
		sessionStorage.removeItem("fulfillment")
		sessionStorage.removeItem("select_current_user")
		sessionStorage.removeItem("remember_session_table")
		sessionStorage.clear()
		 Router.push(`/`)
	  }

	  handlevalue=()=>{}

	render(){
		const{dashboard,user_info}=this.props
		const{selected_user}= this.state
		return(
			<nav className="navbar navbar-expand-sm bg-white">
				<div className="container-fluid">
					<nav className="navbar navbar-expand-sm waiters-nav justify-content-start col-md-12">
		   				<div className='d-flex justify-content-between w-100'>
			  				<div className='user-logo'>
				  				<div className='nav-cricle'>
					  				<ul className='cricle-btn-ul'>
						  				<li className='waiters-haeder-li'>
						   					{/* <span className='user-name-logo bg-light-green' style={{backgroundColor: user_info.name_bg_color }} >{user_info?.short_name}</span> */}
						   					<span className={`user-name-logo ${user_info.name_bg_color}`}>{user_info?.short_name}</span>
						  				</li>
						  				<li className='waiters-haeder-li'>
											<span className='customer-name-logo'>{user_info?.name}</span>
						  				</li>
					  				</ul>
				  				</div>
			  				</div>
			  				<div className='waiters-datetime text-secondary'>
								<Clock/>
			  				</div>
							<div className='waiters-dropdown'>
								<ul className='cricle-btn-ul d-flex justify-content-between'>
									<li className='waiters-haeder-li'>
										<select className="form-select waiter-select"  value={selected_user?selected_user:""} onChange={this.selectuser} >
											{dashboard.map((area,index) => (									
												<option key={index} value={JSON.stringify({id:area.id, name:area.name})} onChange={this.handlevalue} >{area.name}</option>
											))};                                    
                        				</select>
									</li>
									<li className='waiters-haeder-li'>
										<span className='customer-name-logo'>
											<Image alt="logout_symbol" width={18} height={27} src='/assets/images/waiter-logo.PNG' onClick={this.logout}></Image>
										</span>
									</li>
								</ul>
			  				</div>
		   				</div>
		  			</nav>  
		  		</div>
		  	</nav>
					  
        )		
		}	


}
