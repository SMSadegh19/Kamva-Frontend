import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Stepper from '../components/SpecialComponents/RegistrationProcess/Stepper';
import {
  applyDiscountCodeAction,
  getOneEventInfoAction,
  getOneRegistrationFormAction,
  getOneRegistrationReceiptAction,
  purchaseEventAction,
  submitRegistrationFormAction,
} from '../redux/slices/events';
import { addNotificationAction } from '../redux/slices/notifications';
import { toPersianNumber } from '../utils/translateNumber';
import Layout from './Layout';

const useStyles = makeStyles((theme) => ({
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
}));

const Payment = ({
  getOneEventInfo,
  purchaseEvent,
  addNotification,
  applyDiscountCode,
  getOneRegistrationReceipt,

  discountedPrice,
  event,
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [discountCode, setDiscountCode] = useState();
  const [price, setPrice] = useState(0);

  useEffect(() => {
    getOneEventInfo({ eventId });
  }, []);

  useEffect(() => {
    if (event?.merchandise?.price) {
      setPrice(event?.merchandise?.price);
    }
  }, [event]);

  useEffect(() => {
    if (discountedPrice) {
      setPrice(discountedPrice);
    }
  }, [discountedPrice]);

  useEffect(() => {
    if (event?.registration_receipt) {
      getOneRegistrationReceipt({ id: event?.registration_receipt });
    }
  }, [event]);

  const goForPurchase = () => {
    purchaseEvent({ merchandise: event?.merchandise?.id, code: discountCode });
  };

  const submitDiscount = () => {
    if (!discountCode) {
      addNotification({
        message: 'کد تخفیفت را وارد کن!',
        type: 'error',
      });
      return;
    }
    applyDiscountCode({
      merchandise: event?.merchandise?.id,
      code: discountCode,
    });
  };

  if (event?.is_user_participating) {
    navigate(`/event/${eventId}/`);
  }


  if (event?.user_registration_status && !['Waiting', 'Accepted', 'Rejected'].includes(event?.user_registration_status)) {
    navigate('/events/');
  }

  let step = 1;
  if (event?.user_registration_status == 'Accepted') step++;

  return (
    <Layout>
      <Grid container justifyContent="space-evenly" alignItems="center" spacing={4}>
        <Grid item xs={12}>
          <Typography align="center" className={classes.title}>
            {'وضعیت ثبت‌نام'}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Stepper step={step} />
        </Grid>

        <Grid item xs={12}>
          <Grid
            component={Paper}
            container
            justifyContent="center"
            alignItems="flex-end"
            spacing={2}>
            {event?.user_registration_status == 'Accepted' && (
              <>
                <Grid item container justifyContent="center" alignItems="center">
                  <Typography variant='h6' fullWidth align="center">
                    {
                      'شما برای شرکت در این رویداد پذیرفته‌شده‌اید! توجه کنید تا پرداخت خود را انجام ندهید، ثبت‌نامتان قطعی نشده است.'
                    }
                  </Typography>
                </Grid>
                <Grid
                  xs={12}
                  sm={6}
                  md={4}
                  item
                  container
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="کد تخفیف"
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={submitDiscount}>
                      {'اعمال'}
                    </Button>
                  </Grid>
                </Grid>
                <Grid
                  xs={12}
                  sm={6}
                  md={4}
                  item
                  container
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}>
                  <Grid item xs={12}>
                    <Typography fullWidth align="center" gutterBottom>
                      {'مبلغ قابل پرداخت:'}
                    </Typography>
                    <Typography
                      fullWidth
                      align="center"
                      className={classes.subtitle}>
                      {`${toPersianNumber(price)} تومان`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={goForPurchase}>
                      {'پرداخت'}
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
            {event?.user_registration_status == 'Waiting' && (
              <>
                <Grid
                  item
                  container
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}>
                  <Typography fullWidth align="center">
                    {
                      'شما فرم‌ثبت‌نام در این رویداد را پر کرده‌اید! منتظر نتیجه‌ی بررسی از جانب ما باشید.'
                    }
                  </Typography>
                </Grid>
              </>
            )}
            {event?.user_registration_status == 'Rejected' && (
              <>
                <Grid
                  item
                  container
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}>
                  <Typography fullWidth align="center">
                    {'متاسفانه شما برای شرکت در این رویداد پذیرفته‌نشده‌اید :('}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  events: state.events.events || [],
  event: state.events.event,
  receipt: state.events.receipt,
  registrationForm: state.events.registrationForm,
  discountedPrice: state.events.discountedPrice,
});

export default connect(mapStateToProps, {
  getOneRegistrationForm: getOneRegistrationFormAction,
  getOneEventInfo: getOneEventInfoAction,
  purchaseEvent: purchaseEventAction,
  submitRegistrationForm: submitRegistrationFormAction,
  addNotification: addNotificationAction,
  applyDiscountCode: applyDiscountCodeAction,
  getOneRegistrationReceipt: getOneRegistrationReceiptAction,
})(Payment);
