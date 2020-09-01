import gql from 'graphql-tag';

export default gql`
    query getCommentsByUserId($userId: Int!) {
        user_comment(where: {user_id: {_eq: $userId}}) {
            rating
            text
            id
            fuel_station {
                picture
                id
                name
                latitude
                longitude
                user_comments {
                    rating
                }
                fuel_station_pictures {
                    id
                    x
                    y
                    zoom
                    image_key
                }
                test_purchases(order_by: {date: asc}, where: {active: {_eq: true}}) {
                    rating
                    octane_rating
                    purchased_density
                    volume_rating
                }
            }
            user_likes {
                value,
            }
        }
    }

`;
