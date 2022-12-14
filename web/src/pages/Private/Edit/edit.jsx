import React, {useState, useEffect} from 'react';
import IceContainer from '@icedesign/container';
import {Input, Form, Button} from '@alifd/next';
import styles from '../../../layouts/css/form.module.scss';
import {http} from '../../../tool/api/request';
import {msg, lo, isNull} from '../../../tool/fun';

import useReactRouter from 'use-react-router';

const FormItem = Form.Item;
const los = lo();
const formItemLayout = {
    labelCol: {xxs: 8, s: 3, l: 3},
    wrapperCol: {s: 12, l: 10},
};
const formItemLayoutP10 = {
    labelCol: {xxs: 8, s: 3, l: 3},
    wrapperCol: {s: 5, l: 5},
};

export default function GroupedForm() {

    const route = useReactRouter();
    const history = route.history;

    const [guid, setGuid] = useState('0');
    const [detail, setDetail] = useState({
        guid: "",
        title: "",
        soKey: "",
        sendNumber: 0,
        sendAccountNumber: 0,
        accountNumber: 0,
        timer: 0,
        remark: "",
    });

    useEffect(() => {
        // console.log(isNull(route.match.params.id));
        // console.log(route.match.params.id);
        // console.log(typeof (route.match.params.id));

        if (isNull(route.match.params.id) == false) {
            getDetail({guid: route.match.params.id});
            setGuid(route.match.params.id);
        } else {
            setGuid("0");
        }
    }, []);


    const formChange = (values, field) => {
        setDetail(values);
    };

    const submit = (values, errors) => {
        // let user_id = los.get("user_id");
        if (!errors) {
            if (isNull(guid)) {
                values.guid = "0"
                console.log('addValues', values);
                pushAdd(values);
            } else {
                // console.log('editVal', values);
                values.guid = guid;
                if (isNull(values.remark)) {
                    values.remark = ""
                }
                // console.log(values);
                pushEdit(values);
            }
        } else {
            msg.error(errors);
            console.error('submit', errors);
        }
    };

    const getDetail = (param) => {

        msg.loading('locaing..');

        http.private.one(param)
            .then(res => {
                msg.hide();
                if (res.code == 200) {
                    console.log(res.data);
                    setGuid(res.data.guid);
                    let i = res.data;
                    let info = {
                        guid: i.guid,
                        title: isNull(i.title) ? "" : i.title,
                        soKey: isNull(i.soKey) ? "" : i.soKey,
                        sendNumber: isNull(i.sendNumber) ? "" : i.sendNumber,
                        sendAccountNumber: isNull(i.sendAccountNumber) ? "" : i.sendAccountNumber,
                        accountNumber: isNull(i.accountNumber) ? "" : i.accountNumber,
                        timer: isNull(i.timer) ? "" : i.timer,
                        text: isNull(i.text) ? "" : i.text,
                    };
                    setDetail(info);
                } else {
                    msg.error(res.msg);
                    console.error('login error');
                }
            })
            .catch(error => {
                msg.error(error);
                console.log('error', error);
            });
    };


    const pushEdit = (params) => {
        http.private.edit(params)
            .then(res => {
                if (res.code == 200) {
                    history.push('/private/list');
                } else {
                    msg.error("????????????..");
                    console.error('error edit', error);
                }
            })
            .catch(error => {
                msg.error("????????????..");
                console.log('error edit', error);
            });
    };

    const pushAdd = (param) => {
        http.private.add(param)
            .then(res => {
                if (res.code == 200) {
                    history.push('/private/list');
                } else {
                    msg.error("????????????..");
                    console.error('error', error);
                }
            })
            .catch(error => {
                msg.error("????????????..");
                console.log('error', error);
            });
    };

    const view = () => {
        return (
            <div className="grouped-form">
                <IceContainer className={styles.container}>
                    <div className={styles.topFanhui}>
                        <Button type="normal" size="small" onClick={() => {
                            history.push('/private/list');
                        }}>??????</Button>
                    </div>
                    <Form onChange={formChange}>
                        <div>
                            <div className={styles.subForm}>
                                <h3 className={styles.formTitle}>??????</h3>
                                <div>
                                    <FormItem label="???????????????" {...formItemLayout} required requiredMessage="?????????????????????">
                                        <Input name="title" placeholder="??????????????????" value={detail.title}/>
                                    </FormItem>


                                    <FormItem label="??????????????????" {...formItemLayout} required requiredMessage="??????????????????">
                                        <Input name="soKey" placeholder="????????????????????????????????????" value={detail.soKey}/>
                                    </FormItem>


                                    <FormItem label="???????????????" {...formItemLayoutP10} required requiredMessage="???????????????">
                                        <Input name="sendAccountNumber" placeholder="???????????????????????????????????? ??????10"
                                               value={detail.sendAccountNumber}/>
                                    </FormItem>


                                    <FormItem label="?????????????????????" {...formItemLayoutP10} required
                                              requiredMessage="?????????????????????????????????????????????">
                                        <Input name="accountNumber" placeholder="???????????????????????????:3"
                                               value={detail.accountNumber}/>
                                    </FormItem>

                                    <FormItem label="???????????????" {...formItemLayoutP10} required
                                              requiredMessage="?????????????????????">
                                        <Input name="timer" placeholder="??????????????????????????????" value={detail.timer}/>
                                    </FormItem>

                                    <FormItem label="???????????????" {...formItemLayout} required requiredMessage="????????????????????????">
                                        <Input.TextArea
                                            name="text"
                                            placeholder="????????????????????????"
                                            value={detail.text}
                                            aria-label="auto height"
                                            autoHeight={{minRows: 10, maxRows: 15}}
                                        />
                                    </FormItem>

                                    <FormItem label="?????????" {...formItemLayout} >
                                        <Input name="remark" placeholder="?????????????????????.." value={detail.remark}/>
                                    </FormItem>

                                </div>
                            </div>

                            <FormItem label=" " {...formItemLayout}>
                                <div>
                                    <Form.Submit type="primary" htmlType="submit" validate onClick={submit}>
                                        ??????
                                    </Form.Submit>

                                </div>
                            </FormItem>
                        </div>
                    </Form>
                </IceContainer>
            </div>
        );
    };

    return (view());

}
