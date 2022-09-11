import React from "react";
import { useState, useEffect} from "react";
import {useSelector, useDispatch} from 'react-redux'
import {useHttp} from '../../hooks/http.hook';

import { heroesAdd } from '../../actions';

import { v4 as uuidv4 } from 'uuid';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {

    const dispatch = useDispatch();
    const {request} = useHttp();

    const [formValues, setFormValues] = useState({name:'', description: '', element: ''});
    const [options, setOptions] = useState([]);


    useEffect(() => {
        request("http://localhost:3001/filters")
        .then((list) => {
            setOptions([...list]);
        })
        // eslint-disable-next-line
    }, []);

    const renderOptions = (options) => {
        console.log(options);
        return options.map(({type, name}) => type !== 'all' ? <option value={type}>{name}</option> : null);
    }

    const addID = (hero) => {
        return {
            ...hero,
            id: uuidv4(),
        }
    }

    const addHero = (hero) => {
        const heroWithId = addID(hero);
        request(`http://localhost:3001/heroes/`, 'POST', JSON.stringify(heroWithId))
        .then(() => dispatch( heroesAdd(heroWithId)) )
            // eslint-disable-next-line
    }


    const onSetFormValues = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setFormValues(
                        { ...formValues,
                            [e.target.name] : value
                        }
                );
        }

    const onAddHero = (e) => {
        e.preventDefault();
        addHero(formValues);
    }

    return (
        <form onSubmit={e => onAddHero(e)} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    onChange={e => onSetFormValues(e)}
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    onChange={e => onSetFormValues(e)}
                    required
                    name="description" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    onChange={e => onSetFormValues(e)}
                    required
                    className="form-select" 
                    id="element" 
                    name="element">
                    <option >Я владею элементом...</option>
                    {renderOptions(options)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;