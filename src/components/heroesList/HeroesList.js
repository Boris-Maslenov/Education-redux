import {useHttp} from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup} from 'react-transition-group';
import {createSelector} from '@reduxjs/toolkit';

import { heroDeleted, fetchHeroes, selectAll } from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

import './heroesList.scss';

const HeroesList = () => {

    // const someState = useSelector(state => ({
    //     activeFilter: state.filters.activeFilter,
    //     heroes: state.heroes.heroes,
    // }));
    // p.s Не оптимизированный вариант: каждом изменении объекта будет перерисовываться, потому что в хуже идет строгое сравнение объектов, которые никогад не равны друг-другу

    // const filteredHeroes = useSelector(state => {
    //         if (state.filters.activeFilter === 'all') return state.heroes.heroes;
    //     return state.heroes.heroes.filter( item => item.element === state.filters.activeFilter );
    // });
    // p.s - тоже не идеальный вариант, есть просадка по оптимизации. Даже при изменении state без фактического изменения будет перерендер
    // нужно мемоизировать с помощью библиотеки resselect


    /**
     * reselect - правильный вариант
     */

    const filteredHeroesSelector = createSelector(
        state => state.filters.activeFilter,
        // state => state.heroes.heroes,
        selectAll,
        (filter, heroes) => {
            if (filter === 'all') return heroes;
            return heroes.filter( item => item.element === filter ); 
        }
    );

    const filteredHeroes = useSelector( filteredHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
       dispatch(fetchHeroes()); // данные приходят в срезе
        // eslint-disable-next-line
    }, []);

    const onDelete = useCallback((id) => {
        // Удаление персонажа по его id
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(dispatch(heroDeleted(id)))
            .catch(err => console.log(err));
        // eslint-disable-next-line  
    }, [request]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition
                    timeout={0}
                    classNames="hero">
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }

        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition 
                    key={id}
                    timeout={500}
                    classNames="hero">
                    <HeroesListItem  {...props} onDelete={() => onDelete(id)}/>
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;