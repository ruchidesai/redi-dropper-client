// Implements react componenst:
//  AdminUsersTable - ...
//  AdminUsersPagination - ..
//  AddNewUserForm - ...

var AdminUsersTable = React.createClass({
  getInitialState: function() {
    return {list_of_users:this.props.list_of_users};
  },
  componentWillReceiveProps:function(nextProps){
       this.setState({list_of_users:nextProps.list_of_users});
  },
  render: function() {
    return (    
    <div className="table-responsive" >
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Date Added</th>
                    <th>Email Verified</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {this.state.list_of_users.map(function(record,i) {
                    var email;
                    if(record.email_verified==0){
                        email=<div>Verified</div>;
                    }else if(record.email_verified==1){
                        email=<button className="btn btn-primary btn">Send Verification Email</button>;
                    }
                    
                    return <tr>
                                <td>{record.id}</td>
                                <td>{record.username}</td>
                                <td>{record.email}</td>
                                <td>{record.role}</td>
                                <td>{record.date_added}</td>
                                <td>{email}</td>
                                <td><button className="btn btn-primary btn user-update">Update</button>   <button className="btn btn-primary btn">Remove</button></td>
                            </tr>           
                })}
            </tbody>
        </table>
    </div>
    );
  }
});

var AdminUsersPagination = React.createClass({
  getInitialState: function() {
    return {total_pages:this.props.total_pages,current_page:1};
  },
  componentWillReceiveProps:function(nextProps){
       // this.setState({list_of_files:nextProps.list_of_files,visibility:nextProps.visibility});
  },
  activateOnClick:function(i){
    this.setState({total_pages:this.state.total_pages,current_page:i});
    this.props.changePage(i);
  },
  nextPage:function(){
    var current_page=this.state.current_page;
    if(current_page==this.state.total_pages){
        return;
    }else{
        this.setState({total_pages:this.state.total_pages,current_page:current_page+1});
        this.props.changePage(current_page+1);
    }
  },
  prevPage:function(){
    var current_page=this.state.current_page;
    if(current_page==1){
        return;
    }else{
        this.setState({total_pages:this.state.total_pages,current_page:current_page-1});
        this.props.changePage(current_page-1);
    }
  },
  render: function() {
    var pages=[];
    for(var i=1;i<=this.state.total_pages;i++){
        if(i==this.state.current_page){
            pages.push(<li className="active"><a>{i}</a></li>);
        }else{
            pages.push(<li><a onClick={this.activateOnClick.bind(null,i)}>{i}</a></li>);
        }
    }
    return (
    <nav>
      <ul className="pagination">
        <li>
          <a onClick={this.prevPage} aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {pages}
        <li>
          <a onClick={this.nextPage} aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>  
    );
  }
});


var AddNewUserForm = React.createClass({
  render:function(){

    return (  
    <div className="col-sm-5">
    <h3> Add New User </h3>
    <br/>
        <div className="form-horizontal">
         <div className="form-group">
            <label for="inputEmail3" className="col-sm-2 control-label">Username</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="admin-add-username" placeholder="Username"/>
            </div>
          </div>
          <div className="form-group">
            <label for="inputEmail3" className="col-sm-2 control-label">Email</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="admin-add-email" placeholder="Email"/>
            </div>
          </div>
          <div className="form-group">
            <label for="inputEmail3" className="col-sm-2 control-label">Role</label>
            <div className="col-sm-10">
              <select id="admin-add-role" className="form-control">
                  <option value="admin">Admin</option>
                  <option value="technician">Technician</option>
                  <option value="researcher">Researcher</option>
                </select>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button id="admin-save" className="btn btn-primary btn">Save</button>
            </div>
          </div>
        </div>
    </div>
    )
  }

});

var AdminUserManagement = React.createClass({
  getInitialState: function() {
    return {list_of_users:undefined,total_pages:10};
  },
  componentWillMount:function(){
    var request = Utils.api_request("/api/users/list", "GET", {}, "json", true);
    var _this=this;
    request.success( function(json) {
        _this.setState({list_of_users:json.users,total_pages:10});
    });
    request.fail(function (jqXHR, textStatus, error) {
        console.log('Failed: ' + textStatus + error);
    });
  },
  changePage:function(page_no) {
  },
  render: function() {
    var total_pages = this.state.total_pages;
    var list_of_users=this.state.list_of_users;
    var pagination;

    if(total_pages > 1) {
        pagination = <AdminUsersPagination total_pages={total_pages} changePage={this.changePage}/>;
    }
    var users_table;
    if(list_of_users == undefined) {
        //show some loading screen
    }
    else if (0 == list_of_users.length) {
        users_table = <div>No data to display</div>;
    }
    else {
        users_table = <AdminUsersTable list_of_users={this.state.list_of_users}/> 
    }
    return (  
        <div> 
            {users_table}
            {pagination}
            <AddNewUserForm onSubmit={this.addNewUser}/>
        </div>
    );
  }
});
React.render(<AdminUserManagement/>, document.getElementById("admin-user-managememt"));
