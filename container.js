import React, {Component} from 'react';
import commentsByUserQuery from '../../GraphQL/queries/commentsByUser';
import {Query} from "react-apollo";
import {Ratings as View} from "../../Components/Ratings";
import PropTypes from 'prop-types';

export default class Ratings extends Component {
    render() {
        const {userId, setActiveStation, setCenter} = this.props;
        if (userId === null) {
            return null;
        }
        return (
            <Query
                query={commentsByUserQuery}
                variables={{
                    userId,
                }}
            >
                {({error, loading, data}) => (
                    <View
                        comments={data && data.user_comment ? this.getUniqueStations(data.user_comment) : []}
                        error={error}
                        loading={loading}
                        setActiveStation={setActiveStation}
                        setCenter={setCenter}
                    />
                )}
            </Query>
        )
    };

    getUniqueStations = comments => {
        const ids = [];

        return comments.filter(comment => {
            if (ids.indexOf(comment.fuel_station.id) === -1) {
                ids.push(comment.fuel_station.id);
                return true;
            }
            return false;
        });
    };
}

Ratings.propTypes = {
    userId: PropTypes.number.isRequired,
    setActiveStation: PropTypes.func.isRequired,
    setCenter: PropTypes.func.isRequired,
};
