import React from 'react';
import './App.css';
import 'tachyons';
import Particles from 'react-particles-js';

// Components

import Navigation from './components/navigation/navigation.component';
import SignIn from './components/signin/signin.component';
import Register from './components/register/register.component';
import FaceRecognition from './components/facerecognition/facerecognition.component';
import Logo from './components/logo/logo.component';
import ImageLinkForm from './components/imagelinkform/imagelinkform.component';
import Rank from './components/rank/rank.component';

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    password: '',
    entries: 0,
    joined: ''
  }
}

class App extends React.Component {

  constructor() {
    super();

    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {

      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);

      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (e) => {
    this.setState({input: e.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://desolate-shore-54624.herokuapp.com/imageurl',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => { 
      if (response) {
        // Every Fetch needs to have a catch for better Error handling
        fetch('https://desolate-shore-54624.herokuapp.com/image',{
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count }))
        })
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
      // do something with response
      // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState); 
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }

    this.setState({route: route});
  }

  render() {

    const { isSignedIn, imageUrl, route, box, user } = this.state;
    const { name, entries } = user;

    const particlesOptions = {
      particles: {
        number: {
          value: 150,
          density: {
            enable: true,
            value_area: 800
          }
        }
      },
      interactivity: {
        detect_on: 'window',
        events: {
          onhover: {
            enable: true,
            mode: 'repulse'
          },
          modes: {
            repulse: {
              distance: 150
            }
          }
        }
      }
    }

    return (
      <div className="App">
          <Particles className='particles'
            params={particlesOptions}
          />
          <Navigation 
            onRouteChange={this.onRouteChange}
            isSignedIn={isSignedIn} />
          { route === 'home'
            ? <div>
                <Logo />
                <Rank 
                  name = {name}
                  entries = {entries}  
                />
                <ImageLinkForm 
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit} 
                />  
                <FaceRecognition box={box} imageUrl={imageUrl}/>
              </div>
            : (
                route === 'signin' 
                ? <SignIn 
                    onRouteChange={this.onRouteChange} 
                    loadUser={this.loadUser}
                  />
                : <Register 
                    onRouteChange={this.onRouteChange} 
                    loadUser={this.loadUser} 
                  />
              )
              
          }
      </div>
    );
  }
}

export default App;
