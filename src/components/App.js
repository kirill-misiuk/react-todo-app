import React, {PureComponent} from 'react'
import NewTask from './NewTask'
import talking from "../images/taking_notes.png";
import Nav from "./Nav";
import TodoItem from "./TodoItem";
import Header from "./header";

export class App extends PureComponent {
    state = {
        todos: [],
        li: 'All'
    };

    componentDidMount() {
        this.hydrateStateWithLocalStorage();
        window.addEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );
    }

    componentWillUnmount() {
        window.removeEventListener(
            "beforeunload",
            this.saveStateToLocalStorage.bind(this)
        );
        this.saveStateToLocalStorage();
    }

    handleSubmitButton = value => this.setState(({todos}) => ({todos: [value, ...todos]}));
    handleNavButtons = value => this.setState(({li: value}));
    handleDoneTodo = id => this.setState(({todos}) => ({
        todos: todos.map((todo) => {
            let done = todo.done;
            if (todo.id === id) done = !todo.done;
            return {
                ...todo,
                done: done
            };
        })
    }));
    handleFilterSearch = (value) => {
        console.log(value);
        const {todos} = this.state;
        const a = [...todos];
        this.setState({
            todos: a.map((t) => {
                let flag = false;
                (t.todo.indexOf(value) !== -1) ? flag = true : flag = false;
                return {
                    ...t,
                    search: flag
                };
            })
        });
        this.setState({tab: 'Search'});
        if (value === '') {
            this.setState({todos: a.map(t => ({...t, search: false}))});
            this.setState({tab: 'All'});
        }

        this.setState({li: 'Search'});
        if (value === '') {
            this.setState({todos: a.map(t => ({...t, search: false}))});
            this.setState({li: 'All'});
        }
    };

    handleFavoriteTodo = id => this.setState(({todos}) => ({
        todos: todos.map((todo) => {
            let favorite = todo.favorite;
            if (todo.id === id) favorite = !todo.favorite;
            return {
                ...todo,
                favorite: favorite
            };
        })
    }));
    handleDeleteTodo = id => this.setState(({todos}) => ({
        todos: todos.filter(todo => todo.id !== id)
    }));

    saveStateToLocalStorage() {
        for (const key in this.state) {
            localStorage.setItem(key, JSON.stringify(this.state[key]));
        }
    }

    hydrateStateWithLocalStorage() {
        for (const key in this.state) {
            if (localStorage.hasOwnProperty(key)) {
                let value = localStorage.getItem(key);
                try {
                    value = JSON.parse(value);
                    this.setState({[key]: value});
                } catch (e) {
                    this.setState({[key]: value});
                }
            }
        }
    }

    render() {

        const {todos, li} = this.state;
        let liArr = [];
        if (li === 'All') liArr = todos;
        if (li === 'Active') liArr = todos.filter(value => !value.done);
        if (li === 'Done') liArr = todos.filter(value => value.done);
        if (li === 'Search') liArr = todos.filter(value => value.search);
        return (
            <div>
                <Header onSearch={this.handleFilterSearch}/>
                <Nav todos={todos} nav={this.handleNavButtons}/>
                <img id='taking-notes' src={talking} alt='talking-notes'/>
                <NewTask onSubmit={this.handleSubmitButton}/>
                <div id='list-container'>
                    <ul className="todo-list">
                        {liArr.map(todo => (
                            <TodoItem
                                key={todo.id}
                                favorite={todo.favorite}
                                done={todo.done}
                                toggleDeleteButton={this.handleDeleteTodo}
                                toggleDoneButton={this.handleDoneTodo}
                                toggleFavoriteButton={this.handleFavoriteTodo}
                                {...todo}
                            />
                        ))}
                    </ul>
                </div>
            </div>

        )
    }
}

export default App