import { useState } from 'react';
import Head from 'next/head';
import { canSSRAuth } from "../../utils/canSSRAuth";
import { Header } from '../../components/Header';
import styles from './styles.module.scss';
import { FiRefreshCcw } from 'react-icons/fi';
import { setupApiClient } from '../../services/api';
import Modal from 'react-modal';
import { ModalOrder } from '../../components/ModalOrder';


type OrderProps = {
    id: string;
    table: string | number;
    status: boolean;
    draft: boolean;
    name: string | null;
}

interface HomeProps {
    orders: OrderProps[];
}

export type OrderItemProps = {

    id: string;
    amount: number;
    orderId: string;
    productId: string;
    product: {
        id: string;
        name: string;
        description: string;
        price: string;
        banner: string;
    }
    Order: {
        id: string;
        table: string | number;
        status: boolean;
        name: string | null;
    }
}



export default function Dashboard({ orders }: HomeProps) {

    const [orderList, setOrderList] = useState(orders || []);

    const [modalItem, setModalItem] = useState<OrderItemProps[]>()
    const [modalVisible, setModalVisible] = useState(false)

    function handleCloseModal() {
        setModalVisible(false);
    }

    async function handleOpenModalView(id: string) {
        const apiClient = setupApiClient();

        const response = await apiClient.get('/order/detail', {
            params: {
                orderId: id,
            }
        });

        setModalItem(response.data);
        setModalVisible(true);
    }

    async function handleFinishItem(id: string) {
        const apiClient = setupApiClient();
        await apiClient.put('/order/finish', {
            orderId: id,
        });

        const response = await apiClient.get('/orders');
        setOrderList(response.data);

        // fechar modal
        setModalVisible(false);
    }

    // função de refresh
    async function handleRefreshOrders() {
        const apiClient = setupApiClient();

        const response = await apiClient.get('/orders');

        setOrderList(response.data);
    }

    Modal.setAppElement('#__next');

    return (
        <>
            <Head>
                <title>Painel - RestOn</title>
            </Head>
            <div>
                <Header />
                <main className={styles.container}>
                    <div className={styles.containerHeader}>
                        <h1>Últimos pedidos</h1>
                        <button onClick={handleRefreshOrders} className={styles.refresh}>
                            <FiRefreshCcw size={25} color="#3fffa3" />
                        </button>
                    </div>
                    <article className={styles.listOrders}>
                        {orderList.length === 0 && (
                            <span className={styles.emptyList}>
                                Nenhum pedido aberto neste momento... :(
                            </span>
                        )}
                        {orderList.map(item => (
                            <section key={item.id} className={styles.orderItem}>
                                <button onClick={() => handleOpenModalView(item.id)}>
                                    <div className={styles.tag}></div>
                                    <span>Mesa  {item.table}</span>
                                </button>
                            </section>
                        ))}

                    </article>
                </main>
                {modalVisible && (
                    <ModalOrder
                        isOpen={modalVisible}
                        onRequestClose={handleCloseModal}
                        order={modalItem}
                        handleFinishOrder={handleFinishItem}
                    />
                )}
            </div>
        </>
    )
}

// funcao para deicar somente usuarios logados acessar a pagina
export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupApiClient(ctx);

    const response = await apiClient.get('/orders')

    // console.log(response.data)

    return {
        props: {
            orders: response.data
        }
    }
});