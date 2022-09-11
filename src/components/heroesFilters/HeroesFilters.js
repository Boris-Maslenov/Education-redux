import {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useHttp} from '../../hooks/http.hook';
import { heroesFiltered } from '../../actions';
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {

    const {request} = useHttp();
    //const filter = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const [filters, setFilters] = useState([]);

    const onSetFilters = (filter) => {
        dispatch(heroesFiltered(filter));
    }

    useEffect(() => {
        request("http://localhost:3001/filters")
        .then(filters => setFilters([...filters]))
        // eslint-disable-next-line
    }, []);


    const filtersArr = filters.map(({type, name, claz}) => type !== 'all' ? <button onClick={() => onSetFilters(type)} key={type} className={'btn ' + claz}>{name}</button> : null);

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    <button onClick = {() => onSetFilters('all')} className="btn btn-outline-dark active">Все</button>
                    {filtersArr}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;