import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { api } from '../../services/api'
import { StackParamsList } from '../../routes/app.routes'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type RouteDetailParams = {
    FinishOrder: {
        number: number | string;
        orderId: string;
    }

}

type FinishOrderRouteProp = RouteProp<RouteDetailParams, 'FinishOrder'>

export default function FinishOrder() {


    const route = useRoute<FinishOrderRouteProp>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    async function handleFinish() {
        try {
            await api.put('/order/send', {
                orderId: route.params?.orderId,
            })

            // navegando para a primeira tela do sistema
            navigation.popToTop();

        } catch (error) {
            console.log('Erro ao FINALIZAR, tente mais tarde ' + error)
        }
    }



    return (

        <View style={styles.container}>
            <Text style={styles.alert}>Você deseja finalizar este pedido?</Text>
            <Text style={styles.title}>Mesa {route.params?.number}</Text>

            <TouchableOpacity style={styles.button} onPress={handleFinish}>
                <Text style={styles.textButton}>Finalizar Pedido</Text>
                <Feather name='shopping-cart' size={20} color='#1d1d2e' />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingHorizontal: '4%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    alert: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 12,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    button: {
        marginTop: 8,
        backgroundColor: '#3fffa3',
        flexDirection: 'row',
        width: '70%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    textButton: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 8,
        color: '#1d1d2e'
    }

})