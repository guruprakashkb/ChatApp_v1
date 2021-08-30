import React from 'react';
import api from '../apiConfig/chats';
import user1 from '../assests/user1.png';
import formatTime from '../util';

class Chats extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            searchKeyword: '',
            activeUserId: '1'               
        }
    }

    reteriveChats = async () => {
        const response = await api.get("/chats");
        this.setState({
            chats: response.data
        })
    }


    componentDidMount() {
        this.reteriveChats();
    }

    updateSearch = (e) => {
        let value = e.target.value;
        this.setState({
            searchKeyword: value
        })
    }

    messageRead = async (id) => {
        const updateChat = {
            messageSeen : "seen"
        }
       await api.patch(`/chats/${id}`, updateChat);
       this.reteriveChats();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.chatUpdated != this.props.chatUpdated) {
            this.reteriveChats();
        }
    }

    

    render() {

        
        return (
            <div className="chats">
                <div className="chatHeader">
                    <button className="btn chtbtn">+ Create New Chat</button>
                    <h4>Chats</h4>
                    <p>Recent Chats <i class="fas fa-chevron-down"></i></p>

                </div>
             
                <input type="text" name="serach" className="form-control search" onChange={this.updateSearch} placeholder="&#128269;&nbsp;Search" />
                <select className="form-control filter">
                    <option defaultValue >Message</option>
                </select>
               
                <div className="chatBody">
                    {
                        this.state.chats.map((user) => {
                            if (user.userName && user.userName.toLowerCase().indexOf(this.state.searchKeyword) > -1) {
                                return (
                                    <div className= { (this.state.activeUserId == user.id) ? "customCardActive" : "customcard" }   onClick={() => { this.props.toggleChat(user.id); this.messageRead(user.id);this.setState({ activeUserId: user.id }); }}>
                                        <div className="cardHeader">
                                        <p className="modifiedTime">{formatTime(user.lastLogin)}</p>  
                                        <span className= { (user.availabe == "Yes") ? "active" : "away" } ></span>                                      
                                        <img className="imgStyle" src={user1} alt=" "  />    
                                        <div className="nameWrapper">
                                        <div className="titleStyle">{user.userName}</div>
                                        <div className="capStyle">last online {formatTime(user.lastLogin)}</div>
                                             </div>                                   
                                      
                                        </div>                          
                                        
                                        <div className="cardBody">
                                            <div className= { (user.messageSeen == "unread") ? "msgNotificationOn" : "msgNotificationOff" }>&nbsp;1</div>
                                            <p className="card-text">{user.lastMessage}</p>
                                            <div className = "cardAttachments">
                                                <span className= { (user.files == "Yes") ? "fileAttached" : "disableFileAttached" }><i class="far fa-file-alt"></i>&nbsp;Files (x2)</span>
                                                <span className= { (user.photos == "Yes") ? "photoAttached" : "disablePhotoAttached"}><i class="far fa-image"></i>&nbsp;Photo&nbsp;</span>
                                            </div>

                                        </div>

                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>

        )
    }
}

export default Chats;
