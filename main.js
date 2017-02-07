import Exponent from 'exponent';
import React from 'react';
import {ScrollView, Text, StyleSheet, Button} from 'react-native';
import {StackNavigator, TabNavigator, addNavigationHelpers} from 'react-navigation';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';

// This function is used to create components.
// It expects a name and a list of optional links to other routes.
// The generated component is connected to Redux to display the content of the store.
// This function is used below to easily generate components.
function createComponent(name, navigateTo = []) {
  return connect(state => ({redux: state}))(({navigation, redux}) => (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>I am component {name}</Text>
        {navigateTo.map(route => (
          <Button key={route} title={`Go to ${route}`} onPress={() => navigation.navigate(route)} />
        ))}
        <Text style={styles.title}>Store</Text>
        <Text style={styles.store}>{JSON.stringify(redux, undefined, 2)}</Text>
      </ScrollView>
    )
  )
}


// The nested StackNavigator
const NestedNavigator = StackNavigator({
  StackOne: {screen: createComponent('StackOne', ['StackTwo'])},
  StackTwo: {screen: createComponent('StackTwo', ['TabA'])}
});


// Two tabs, second one is a nested StackNavigator
export const MainNavigator = TabNavigator({
  TabA: {
    screen: createComponent('TabA', ['TabNested'])
  },
  TabNested: {
    screen: NestedNavigator
  },
});


// This connects the MainNavigator to Redux to delegate the whole routing
const AppWithNavigationState = connect(
  state => ({
    nav: state,
  }))(({dispatch, nav}) => (
  <MainNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
));


// Redux setup.
// Creating reducer from the main navigator.
const appReducer = (state, action) => MainNavigator.router.getStateForAction(action, state);
const store = createStore(appReducer);


// This is the component that bootstraps the app.
export class MinimalNestedReduxApp extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}


// Ignore what is below. It is just some basic styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  title: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 16,
  },
  store: {
    padding: 6,
    backgroundColor: '#eee',
  }
});


Exponent.registerRootComponent(MinimalNestedReduxApp);
