import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderBack from '../components/global/HeaderBack';
import Color from '../assets/fonts/Color';
import {DayOfTheWeeks} from '../utils/DayOfTheWeeks';
import axios from 'axios';
import {IP_Address} from '../utils/IP_Address';
import DatePicker from 'react-native-date-picker';
import ItemWork from '../components/work/ItemWork';
import {useSelector} from 'react-redux';

const WorkSchedule = ({navigation}) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [listWorkSchedule, setListWorkSchedule] = useState([]);
  const [isDaySelected, setIsDaySelected] = useState('Mon');
  const {userName} = useSelector(state => state.user);

  const getInforDate = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayIndex = date.getDay();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    setIsDaySelected(days[dayIndex]);
    return days[dayIndex] + ' ' + day + '-T' + month + '-' + year;
  }, [date]);

  const getMyWorkSchedules = useCallback(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayIndex = date.getDay();
    console.log('call');
    axios
      .post(IP_Address + '/api/work-schedules/my-work', {
        userName: userName,
        dayOfWeek: days[dayIndex],
        fullDate:
          date.getDate() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getFullYear(),
      })
      .then(res => {
        if (res.data) {
          console.log('ok');
        }
      })
      .catch(e => {
        console.log(e);
      });
  }, [date, userName]);
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      getMyWorkSchedules();
    });

    return () => {
      unsub();
    };
  }, [getMyWorkSchedules, navigation]);
  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: Color.blue()}}>
        <Text
          style={{
            fontSize: 32,
            alignSelf: 'center',
            marginBottom: 40,
            color: Color.white(),
          }}>
          Your work schedule
        </Text>
      </SafeAreaView>
      <SafeAreaView
        style={{
          marginTop: -20,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: Color.white(),
          flex: 1,
        }}>
        <View style={{padding: 10}}>
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text style={{fontSize: 20, marginVertical: 10}}>
              {getInforDate}
            </Text>
          </TouchableOpacity>
          <FlatList
            horizontal={true}
            data={DayOfTheWeeks}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    backgroundColor:
                      isDaySelected === item.text ? Color.blue() : null,
                    marginHorizontal: 9,
                    paddingHorizontal: 5,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 10,
                  }}>
                  <Text
                    style={{
                      color:
                        isDaySelected === item.text
                          ? Color.white()
                          : Color.black(),
                    }}>
                    {item.text}
                  </Text>
                  <Text
                    style={{
                      color:
                        isDaySelected === item.text
                          ? Color.white()
                          : Color.black(),
                    }}>
                    {item.num}
                  </Text>
                </View>
              );
            }}
          />
        </View>
        <DatePicker
          modal
          open={open}
          date={date}
          onConfirm={date => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />

        <View style={{flex: 1, padding: 10}}>
          {listWorkSchedule.length === 0 ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text>Ngày này chưa có lịch làm việc</Text>
            </View>
          ) : (
            <FlatList
              data={listWorkSchedule}
              renderItem={({item, index}) => <ItemWork item={item} />}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WorkSchedule;
