import { Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import WorkshopGridItems from '../../components/SpecialComponents/WorkshopsPage/WorkshopGridItems';
import {
  getEventWorkshopsAction,
} from '../../redux/slices/events';
import Layout from '../Layout';
import Sidebar from './Sidebar';

function Workshops({
  workshops,
  eventWorkshopsCount,
  event,
  isLoading,
  getEventWorkshops,
}) {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);

  if (event?.is_user_participating != undefined && !event?.is_user_participating) {
    navigate(`/event/${eventId}/registration_form/`);
  }

  useEffect(() => {
    getEventWorkshops({ eventId, pageNumber });
  }, [pageNumber]);

  // todo: handle in a better way
  if (event?.is_user_participating == undefined) {
    return (<Layout></Layout>)
  }

  return (
    <Layout>
      <Grid container justifyContent='space-evenly' alignItems='flex-start' spacing={2}>
        <Grid container item xs={12} sm={3} direction='column' spacing={3}>
          <Sidebar />
        </Grid>
        <Grid container item xs={12} sm={9} direction='column' spacing={3}>
          <Grid item>
            <Typography variant="h1" align='center'>
              {'کارگاه‌ها'}
            </Typography>
          </Grid>
          <Grid container item spacing={3} justifyContent='flex-start'>
            <WorkshopGridItems
              eventId={eventId}
              workshops={workshops}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item>
            <Grid item>
              <Pagination
                variant="outlined"
                color="primary"
                shape='rounded'
                count={Math.ceil(eventWorkshopsCount / 12)}
                page={pageNumber}
                onChange={(e, value) => setPageNumber(value)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}

const mapStateToProps = (state, ownProps) => ({
  workshops: state.events.workshops,
  isLoading: state.events.getWorkshopsLoading,
  event: state.events.event,
  eventWorkshopsCount: state.events.eventWorkshopsCount,
});

export default connect(mapStateToProps, {
  getEventWorkshops: getEventWorkshopsAction,
})(Workshops);
