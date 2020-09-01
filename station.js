import React, { Component, Fragment } from 'react';
import { card } from "./Style";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CheckIcon from '@material-ui/icons/CheckCircle';
import UnknownIcon from '@material-ui/icons/Help';
import ProblemIcon from '@material-ui/icons/ReportProblem';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import classNames from 'classnames';
import Error from "../Error";
import Loader from "../Loader";
import Empty from "../Empty";
import Chip from '@material-ui/core/Chip';
import Hint from '../Hint';
import { BookmarkIcon } from "../Bookmarks";
import {getRating, getOctanReting, getImage} from "../../utils";

class Station extends Component {
    state = {
        arrowRef: null,
    };
    getName = () => {
        const { station } = this.props;
        let result = '';
        if (station.brand !== '' && station.brand !== undefined) {
            result += station.brand
        } else {
            return 'Нет названия';
        }
        if (station.name !== '' && station.name !== undefined) {
            result += `(${station.name})`;
        }
        return result;
    };

    render() {
        const { classes, station, error, loading, hoveredStation, bookmarks, cardRef, userId, images } = this.props;
        const { arrowRef } = this.state;
        if (error) return <Error error={error} />;
        if (loading) return <Loader />;
        if (!station.id) return <Empty />;

        const testPurchasesActive = station.test_purchases.filter(el => el.active);

        return (
            <Card
                className={classNames(
                    classes.card, `cardForLine_${station.id}`,
                    (hoveredStation === station.id) ? classes[this.getColor()] : null
                )}
                onMouseEnter={this.onMouseOver}
                onMouseLeave={this.onMouseOut}
                ref={cardRef ? cardRef : null}
            >
                <CardMedia
                    className={classes.media}
                    image={getImage(images)}
                    onClick={this.handleClick}
                />
                <CardContent classes={{
                    root: classNames(
                        classes.content,
                        (hoveredStation === station.id) ? classes.cardHovered : null
                    )
                }}>
                    <div className={classes.header}>
                        <Tooltip placement="top-start"
                            classes={{
                                tooltip: classes.tooltip,
                                popper: classes.popperid,
                            }}
                            PopperProps={{
                                popperOptions: {
                                    modifiers: {
                                        arrow: {
                                            enabled: Boolean(arrowRef),
                                            element: arrowRef,
                                        },
                                    },
                                },
                            }}
                            title={
                                <Fragment>
                                    <Typography
                                        variant="caption"
                                        color="inherit"
                                        className={classes.caption}
                                        component={'p'}
                                    >
                                        {station.id}
                                    </Typography>
                                    <span className={classes.idarrow} ref={this.setArrowRef} />
                                </Fragment>
                            }>
                            <Typography variant="subtitle1" color="inherit" className={classes.title}>
                                <div className={classes.name}>
                                    <div className={classes.wrapWord}>
                                        {this.getName()}
                                    </div>
                                    <div style={{ fontSize: 10 }}>
                                        {station.operator ? station.operator : ''}
                                    </div>
                                </div>
                            </Typography>
                        </Tooltip>
                        <div className={classes.status}>
                            <Tooltip
                                placement="top-start"
                                classes={{
                                    tooltip: classes.tooltip,
                                    popper: classes.popper,
                                }}
                                PopperProps={{
                                    popperOptions: {
                                        modifiers: {
                                            arrow: {
                                                enabled: Boolean(arrowRef),
                                                element: arrowRef,
                                            },
                                        },
                                    },
                                }}
                                title={
                                    <Fragment>
                                        <Typography
                                            variant="caption"
                                            color="inherit"
                                            className={classes.caption}
                                            component={'p'}
                                        >
                                            {this.getTooltipTitle()}
                                        </Typography>
                                        <span className={classes.arrow} ref={this.setArrowRef} />
                                    </Fragment>
                                }
                            >
                                {this.getStatus()}
                            </Tooltip>
                        </div>
                        {userId ? (
                            <BookmarkIcon
                                stationId={station.id}
                                userId={userId}
                                isAdded={!!bookmarks.find(bookmark => bookmark.fuel_station_id === station.id)}
                            />
                        ) : null}
                    </div>
                    {testPurchasesActive.length > 0 ? (
                        <List dense disablePadding>
                            <ListItem disableGutters className={classes.listItem}>
                                <ListItemText
                                    classes={{
                                        root: classes.list,
                                        primary: classes.text,
                                        secondary: classes.text,
                                    }}
                                    className={classes.list}
                                    primary="Объем:"
                                    secondary={this.getVolumeRating()}
                                    secondaryTypographyProps={{
                                        component: 'div',
                                    }}
                                />
                            </ListItem>
                            <ListItem disableGutters className={classes.listItem}>
                                <ListItemText
                                    classes={{
                                        root: classes.list,
                                        primary: classes.text,
                                        secondary: classes.text,
                                    }}
                                    primary="Октановое число:"
                                    secondary={this.getRatingString()}
                                />
                            </ListItem>
                            <ListItem disableGutters className={classes.listItem}>
                                <ListItemText
                                    classes={{
                                        root: classes.list,
                                        primary: classes.text,
                                        secondary: classes.text,
                                    }}
                                    primary="Рейтинг:"
                                    secondary={<React.Fragment>
                                        <div>
                                            {this.getStars()}
                                        </div>
                                    </React.Fragment>}
                                    secondaryTypographyProps={{
                                        component: 'div',
                                    }}
                                />
                            </ListItem>
                        </List>
                    ) : null}
                </CardContent>
            </Card>
        );
    };

    setArrowRef = arrowRef => {
        this.setState({ arrowRef })
    };

    onMouseOver = () => {
        const { station, setHoveredStation } = this.props;
        setHoveredStation(station.id, true);
    };
    onMouseOut = () => {
        const { setHoveredStation } = this.props;
        setHoveredStation(null, true);
    };

    getRatingString = () => {
        const { station, classes } = this.props;
        const rating = getOctanReting(station.test_purchases);
        const result = [];
        let color = 0;
        if (station.test_purchases.length) {
            color = getOctanReting(station.test_purchases);
        }

        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                result.push(
                    <StarIcon
                        className={classNames(classes.ratingIcon, classes[`starColor${color}`])}
                        key={i}
                    />
                );
            } else if (i > rating && i + 1 < rating) {
                result.push(
                    <StarHalfIcon
                        className={classNames(classes.ratingIcon, classes[`starColor${color}`])}
                        key={i}
                    />
                );
            } else {
                result.push(
                    <StarBorderIcon
                        className={classNames(classes.ratingIcon, classes[`starColor${color}`])}
                        key={i}
                    />
                );
            }

        }
        return result;
    };

    getStars = () => {
        const { classes, station } = this.props;
        const result = [];
        const rating = getRating(station.test_purchases);

        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                result.push(<StarIcon className={classes.ratingIcon} key={i} />);
            } else if (i > rating && i + 1 < rating) {
                result.push(<StarHalfIcon className={classes.ratingIcon} key={i} />);
            } else {
                result.push(<StarBorderIcon className={classes.ratingIcon} key={i} />);
            }

        }
        return result;
    };

    getTooltipTitle = () => {
        const { station } = this.props;
        let result = 'Ещё не проверено';

        if (station.user_comments.length) {
            result = 'Проверено пользователями';
        }

        if (!station.test_purchases.length) {
            return result;
        }

        const rating = getRating(station.test_purchases);

        if (rating < 3.4) {
            result = 'Есть вопросы';
        } else if (rating >= 3.5 && rating < 4.4) {
            result = 'Есть проблемы';
        } else {
            result = 'Честно';
        }

        return result;
    };

    getColor = () => {
        const { station } = this.props;

        const rating = getRating(station.test_purchases);

        if (!station.test_purchases.length) {
            return 'cardHoveredN';
        }

        if (rating < 3.4) {
            return 'cardHoveredP';
        }
        if (rating >= 3.5 && rating < 4.4) {
            return 'cardHoveredM';
        } else {
            return 'cardHoveredG';
        }
    };

    getStatus = () => {
        const { classes, station } = this.props;
        let result = (
            <div className={classes.statusBlock}>
                <UnknownIcon className={classes.statusIcon} />
                <Typography variant="body2" color="inherit" className={classes.statusText}>
                    не проверено
                </Typography>
            </div>
        );

        if (station.user_comments.length) {
            result = (
                <div className={classes.statusBlock}>
                    <CheckIcon className={classNames(classes.statusIcon, classes.statusColorNormal)} />
                    <Typography variant="body2" color="inherit" className={classes.statusText}>
                        проверено
                    </Typography>
                </div>
            );
        }

        if (!station.test_purchases.length) {
            return result;
        }

        const rating = getRating(station.test_purchases);

        if (rating < 3.4) {
            result = (
                <div className={classes.statusBlock}>
                    <ProblemIcon className={classNames(classes.statusIcon, classes.statusColorFail)} />
                    <Typography variant="body2" color="inherit" className={classes.statusText}>
                        проверено
                    </Typography>
                </div>
            );
        } else if (rating >= 3.5 && rating < 4.4) {
            result = (
                <div className={classes.statusBlock}>
                    <CheckIcon className={classNames(classes.statusIcon, classes.statusColorNormal)} />
                    <Typography variant="body2" color="inherit" className={classes.statusText}>
                        проверено
                    </Typography>
                </div>
            );
        } else {
            result = (
                <div className={classes.statusBlock}>
                    <CheckIcon className={classNames(classes.statusIcon, classes.statusColorGood)} />
                    <Typography variant="body2" color="inherit" className={classes.statusText}>
                        проверено
                    </Typography>
                </div>
            );
        }

        return result;
    };

    handleClick = () => {
        const { station, setActiveStation, setCenter } = this.props;
        setActiveStation(station.id);
        setCenter({
            lat: station.latitude,
            lng: station.longitude,
        });
    };

    getVolumeRating = () => {
        const { station, hintContent, classes } = this.props;
        const testPurchasesActive = station.test_purchases.filter(el => el.active);

        return (
            <div style={{display: 'flex', alignItems: 'center'}}>
                {station.test_purchases.length ? (
                    <Chip
                        size="small"
                        label={testPurchasesActive[testPurchasesActive.length - 1].purchased_density}
                        className={classNames(
                            classes.chip,
                            classes[`chipColor${testPurchasesActive[testPurchasesActive.length - 1].volume_rating}`]
                        )}
                    />
                ) : (
                    <Chip
                        size="small"
                        label={0}
                        className={classes.chip}
                    />
                )}
                <Hint variant="right" content={hintContent.find(el => el.key === 'ushmb')} />
            </div>
        );
    };
}

Station.propTypes = {
    classes: PropTypes.object.isRequired,
    station: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    hoveredStation: PropTypes.number,
    setHoveredStation: PropTypes.func.isRequired,
    bookmarks: PropTypes.array.isRequired,
    cardRef: PropTypes.object,
    setActiveStation: PropTypes.func.isRequired,
    setCenter: PropTypes.func.isRequired,
    userId: PropTypes.number,
    images: PropTypes.array.isRequired,
};

export default withStyles(card)(Station);
