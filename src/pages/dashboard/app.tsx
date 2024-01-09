// next
import Head from 'next/head';
import { useState, useEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// layouts
import DashboardLayout from '../../layouts/dashboard';
// _mock_
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
} from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from '../../sections/@dashboard/general/app';
// assets
import { SeoIllustration } from '../../assets/illustrations';

// ----------------------------------------------------------------------

GeneralAppPage.getLayout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function GeneralAppPage() {
  const { user } = useAuthContext();

  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  const [countData, setCountData] = useState();

  const [dataTable, setDataTable] = useState([]);
  const [month, setMonth] = useState([]);
  const [countMonth, setCountMonth] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard/count-all")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setCountData(data)
        setMonth(data.chart.map(v => v[2]))
        setCountMonth(data.chart.map(v => v[1]))
      })
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard/order")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setDataTable(data)
      })
  }, []);

  return (
    <>
      <Head>
        <title> General: App | Minimal UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          {countData ?
            <>
              <Grid item xs={12} md={4}>
                <AppWidgetSummary
                  title="تعداد کاربران"
                  percent={2.6}
                  total={countData.userCount}
                  chart={{
                    colors: [theme.palette.primary.main],
                    series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <AppWidgetSummary
                  title="تعداد سفارشات"
                  percent={0.2}
                  total={countData.orderCount}
                  chart={{
                    colors: [theme.palette.info.main],
                    series: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26],
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <AppWidgetSummary
                  title="تعداد کالاهای فعال"
                  percent={-0.1}
                  total={countData.productCount}
                  chart={{
                    colors: [theme.palette.warning.main],
                    series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <AppCurrentDownload
                  title="کل سفارشات"
                  chart={{
                    colors: [
                      theme.palette.primary.main,
                      theme.palette.info.main,
                      theme.palette.error.main,
                      theme.palette.warning.main,
                    ],
                    series: [
                      { label: 'تحویل شده', value: countData.orderCountDelivered },
                      { label: 'تحویل نشده', value: countData.orderCountNotDelivered },
                    ],
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6} lg={8}>
                <AppAreaInstalled
                  title="تعداد سفارشات"
                  subheader="(+43%) than last year"
                  chart={{
                    categories: month,
                    series: [
                      {
                        year: '1400',
                        data: [
                          { name: 'ثبت شده', data: countMonth },
                        ],
                      },
                      {
                        year: '1401',
                        data: [
                          { name: 'ثبت شده', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
                        ],
                      },
                    ],
                  }}
                />
              </Grid> </> : <></>}

          <Grid item xs={12} lg={12}>
            <AppNewInvoice
              title="آخرین سفارشات"
              tableData={dataTable}
              tableLabels={[
                { id: 'id', label: 'شناسه سفارش' },
                { id: 'category', label: 'کاربر' },
                { id: 'price', label: 'مبلغ کل' },
                { id: 'status', label: 'وضعیت' },
                { id: '' },
              ]}
            />
          </Grid>


        </Grid>
      </Container>
    </>
  );
}
