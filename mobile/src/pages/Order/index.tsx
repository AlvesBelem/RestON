import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import { api } from '../../services/api'
import { ModalPicker } from '../../components/ModalPicker'
import { ListItem } from '../../components/ListItem'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamsList } from '../../routes/app.routes'
import Routes from '../../routes';

type RouterDetailParams = {
    Order: {
        number: number | string;
        orderId: string;
    }
}

export type CategoryProps = {
    id: string;
    name: string;
}

type ProductProps = {
    id: string;
    name: string;
}

type ItemProps = {
    id: string;
    productId: string;
    name: string;
    amount: string | number;
}

type OrderRouteProps = RouteProp<RouterDetailParams, 'Order'>;

export default function Order() {

    const route = useRoute<OrderRouteProps>();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    // Modal
    const [modalCategoryVisible, setModalCategoryVisible] = useState(false)

    // Mostarndo e e selecionando categorias
    const [category, setCategory] = useState<CategoryProps[] | []>([]);
    const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>()

    // selecionando quantidade
    const [amount, setAmount] = useState('1');

    //armazenando os produtosd do pedido para criar a lista
    const [items, setItems] = useState<ItemProps[]>([]);

    //selecionando produtos da categoria escolhida e controlendo modal do produto
    const [products, setProducts] = useState<ProductProps[] | []>([]);
    const [productSelected, setProductSelected] = useState<ProductProps | undefined>();
    const [modalProductVisible, setModalProductVisible] = useState(false);



    // Categorias
    useEffect(() => {
        async function loadInfo() {
            const response = await api.get('/category');

            setCategory(response.data);
            setCategorySelected(response.data[0]);
        }
        loadInfo()
    }, [])

    // produtos de uma categoria
    useEffect(() => {
        async function loadProducts() {
            const response = await api.get('/category/product', {
                params: {
                    categoryId: categorySelected?.id
                }
            })
            setProducts(response.data);
            setProductSelected(response.data[0]);
        }
        loadProducts()

    }, [categorySelected])



    async function handleCloseOrder() {

        try {

            await api.delete('/order', {
                params: {
                    orderId: route.params?.orderId,
                }
            })

            navigation.goBack();

        } catch (error) {
            console.log("Error ao deletar o pedido", error);
        }
    }

    function handleChangeCategory(item: CategoryProps) {
        setCategorySelected(item);
    }

    function handleChangeProduct(item: CategoryProps) {
        setProductSelected(item);
    }

    async function handleAdd() {
        const response = await api.post('/order/add', {
            orderId: route.params?.orderId,
            productId: productSelected?.id,
            amount: Number(amount),

        })

        let data = {
            id: response.data.id,
            productId: productSelected?.id as string,
            name: productSelected?.name as string,
            amount: amount
        }

        //pegando todos os itens do array e adicionando o novo item
        setItems(oldArray => [...oldArray, data])
    }

    async function handleDeleteItem(itemId: string) {
        const response = await api.delete('/order/remove', {
            params: {
                itemId: itemId,
            }
        })

        // após remover da api remover da lista de itens
        let removeItems = items.filter(item => {
            return (
                item.id !== itemId
            )
        })

        setItems(removeItems);
    }

    function handleFinishOrder() {
        navigation.navigate('FinishOrder', {
            number: route.params?.number,
            orderId: route.params?.orderId,
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Mesa: {route.params.number}
                </Text>
                {items.length === 0 && (
                    <TouchableOpacity onPress={handleCloseOrder}>
                        <Feather
                            name='trash-2'
                            size={38}
                            color='#ff3f4b'
                        />
                    </TouchableOpacity>
                )}
            </View>

            {category.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={() => setModalCategoryVisible(true)}>
                    <Text style={{ color: '#fff' }}>
                        {categorySelected?.name}
                    </Text>

                </TouchableOpacity>
            )}
            {products.length !== 0 && (
                <TouchableOpacity style={styles.input} onPress={() => setModalProductVisible(true)}>
                    <Text style={{ color: '#fff' }}>{productSelected?.name}</Text>
                </TouchableOpacity>
            )}

            <View style={styles.qtdContainer}>
                <Text style={styles.qtdText}>Quantidade</Text>
                <TextInput
                    style={[styles.input, { width: '55%', textAlign: 'center' }]}
                    placeholder='1'
                    placeholderTextColor='#f0f0f0'
                    keyboardType='numeric'
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            <View style={styles.action}>
                <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
                    <Text style={styles.buttonText}> + </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { opacity: items.length === 0 ? 0.2 : 1 }]}
                    disabled={items.length === 0}
                    onPress={handleFinishOrder}
                >
                    <Text style={styles.buttonText}> Avançar </Text>
                </TouchableOpacity>
            </View>

            <FlatList
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, marginTop: 24 }}
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ListItem data={item} deleteItem={handleDeleteItem} />}
            />

            <Modal
                transparent={true}
                visible={modalCategoryVisible}
                animationType='fade'
            >
                <ModalPicker
                    handleCloseModal={() => setModalCategoryVisible(false)}
                    options={category}
                    selectedItem={handleChangeCategory}
                />

            </Modal>
            <Modal
                transparent={true}
                visible={modalProductVisible}
                animationType='fade'
            >
                <ModalPicker
                    handleCloseModal={() => setModalProductVisible(false)}
                    options={products}
                    selectedItem={handleChangeProduct}
                />
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1d1d2e',
        paddingVertical: '5%',
        paddingEnd: '4%',
        paddingStart: '4%',
    },
    header: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 14,
    },
    input: {
        backgroundColor: '#101026',
        borderRadius: 4,
        width: '100%',
        height: 40,
        marginBottom: 12,
        justifyContent: 'center',
        paddingHorizontal: 8,
        color: "#fff",
        fontSize: 20,
    },
    qtdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    qtdText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    buttonAdd: {
        backgroundColor: '#3fd1ff',
        borderRadius: 4,
        width: '20%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',

    },
    action: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    buttonText: {
        color: '#101026',
        fontSize: 18,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        height: 40,
        width: '75%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});