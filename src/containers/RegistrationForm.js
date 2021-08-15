import { Button, Container, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import AppBar from '../components/Appbar/ResponsiveAppBar';
import Widget from '../components/Widget';
import {
  getOneEventInfoAction,
  getOneRegistrationFormAction,
  submitRegistrationFormAction
} from '../redux/slices/events'
import { toPersianNumber } from '../utils/translateNumber';
import Layout from './Layout';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 80,
    height: `calc(100vh - ${80}px)`,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  logo: {
    maxHeight: '80vh',
    maxWidth: '100%',
  },
  paper: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(2),
  },
  title: {
    fontSize: 40,
    fontWeight: 600,
    textShadow: '1px 1px #dbd9d9',
  },
  subtitle: {
    fontSize: 25,
    fontWeight: 400,
    textShadow: '1px 1px #dbd9d9',
  },
  listItem: {
    fontSize: 20,
    fontWeight: 300,
    textShadow: '1px 1px #dbd9d9',
  },
  notificationTitle: {
    color: '#4d4a70',
  },
  content: {
    padding: '10px !important',
  },
  noPadding: {
    padding: '0px !important',
  },
  eventImage: {
    borderRadius: '5px',
    height: '100%',
    maxHeight: '300px',
    width: '100%',
    objectFit: 'cover',
  },
}));

const EVENT_TYPE = {
  'Team': 'تیمی',
  'Individual': 'انفرادی',
}

const RegistrationForm = ({
  getOneRegistrationForm,
  getOneEventInfo,
  event,
  registrationForm,
  submitRegistrationForm,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { eventId } = useParams()
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    getOneEventInfo({ id: eventId })
  }, [getOneRegistrationForm])

  useEffect(() => {
    if (event?.registration_form) {
      getOneRegistrationForm({ id: event?.registration_form })
    }
  }, [event]);

  if (event?.user_registration_status != 'NotRegistered') {
    history.push(`/event/${eventId}/payment`);
  }

  const doRegister = () => {
    submitRegistrationForm({
      id: event?.registration_form,
      answers,
      eventId,
    })
  }

  const pushAnswer = (problemId, widgetType) => (fieldName, answer) => {
    const temporaryAnswer = answers;

    let doesFind = false;
    for (let i = 0; i < temporaryAnswer.length; i++) {
      if (temporaryAnswer[i].answer_type === widgetType) {
        temporaryAnswer[i] = {
          ...temporaryAnswer[i],
          [fieldName]: answer,
        }
        doesFind = true;
      }
    }
    if (!doesFind) {
      temporaryAnswer.push({
        [fieldName]: answer,
        answer_type: widgetType,
        problem: problemId,
      })
    }
    setAnswers(temporaryAnswer);
  }

  console.log(answers)

  return (
    <Layout>
      <Grid
        container
        justify="space-evenly"
        alignItems="center"
        spacing={4}>
        <Grid item xs={12}>
          <Grid
            component={Paper}
            container
            justify="center"
            alignItems="center"
            spacing={2}>
            <Grid
              className={classes.noPadding}
              item
              container
              justify="center"
              alignItems="center"
              xs={12}
              sm={4}>
              <img
                src={event?.cover_page}
                alt=""
                className={classes.eventImage}
              />
            </Grid>
            <Grid item container direction='column' xs={12} sm={8} spacing={1}>
              <Grid item>
                <Typography gutterBottom align='center' variant='h1'>{`رویداد ${event?.name}`}</Typography>
              </Grid>
              <Grid item>
                <Typography align='center'>{event?.description}</Typography>
              </Grid>
              <Grid item>
                <Typography align='center'>{`نوع مسابقه: ${EVENT_TYPE[event?.event_type]}`}</Typography>
                {event.event_type == 'Team' &&
                  <Typography align='center'>{`تعداد اعضای هر تیم: ${toPersianNumber(event?.team_size)}`}</Typography>
                }
              </Grid>
              <Grid item>
                <Typography align='center'>{`قیمت: ${toPersianNumber(event?.merchandise?.price || 0)} تومان`}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography align='center' className={classes.title}>{'فرم ثبت‌نام'}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid
            component={Paper}
            container
            justify="center"
            alignItems="center"
            spacing={2}>
            {registrationForm?.widgets?.map((widget) => (
              <Grid item key={widget.id} xs={12}>
                <Paper className={classes.paper}>
                  <Widget pushAnswer={pushAnswer(widget?.id, widget?.widget_type)} widget={widget} />
                </Paper>
              </Grid>
            ))}
            <Grid item>
              <Button variant='contained' color='primary' onClick={doRegister}>
                ثبت
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  events: state.events.events || [],
  event: state.events.event,
  registrationForm: state.events.registrationForm,
});

export default connect(
  mapStateToProps,
  {
    getOneRegistrationForm: getOneRegistrationFormAction,
    getOneEventInfo: getOneEventInfoAction,
    submitRegistrationForm: submitRegistrationFormAction,
  }
)(RegistrationForm);